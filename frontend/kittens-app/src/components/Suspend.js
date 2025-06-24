'use client';

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";

export default function UserModerationPanel({ searchText = "" }) {
  const { user } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3001/user/api/users?page=${page}&limit=15`, {
        withCredentials: true,
      });
      setAllUsers(res.data.users);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error("❌ Erreur récupération utilisateurs :", err);
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, [page]);


  const filteredUsers = allUsers.filter(u =>
    u.displayName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const updateUserStatus = async (userId, action) => {
    try {
      await axios.post(`http://localhost:3001/user/api/users/${userId}/${action}`, {}, { withCredentials: true });
      setAllUsers(prev =>
        prev.map(u =>
          u.userId === userId
            ? { ...u, status: action === "reactivate" ? "active" : action === "ban" ? "banned" : "suspended" }
            : u
        )
      );
    } catch (err) {
      console.error(`❌ Erreur lors de l'action ${action} :`, err.response?.data || err.message);
    }
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Modération des utilisateurs</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-col items-center w-full">
          {filteredUsers.length === 0 ? (
            <p className="text-gray-500">Aucun utilisateur trouvé.</p>
          ) : (
            filteredUsers.map((u, index) => (
              <div
                key={index}
                className="w-full sm:w-[calc(50%-0.5rem)] p-4 m-4 border rounded-2xl shadow flex flex-col gap-2"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`http://localhost:3001${u.avatarUrl || "/default-avatar.png"}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{u.displayName}</p>
                    <p className="text-sm text-gray-600">Status : {u.status}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  {u.status !== "banned" && u.status !== "suspended" && (
                    <>
                      <button
                        onClick={() => updateUserStatus(u.userId, "suspend")}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Suspendre
                      </button>
                      <button
                        onClick={() => updateUserStatus(u.userId, "ban")}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Bannir
                      </button>
                    </>
                  )}
                  {(u.status === "suspended" || u.status === "banned") && (
                    <button
                      onClick={() => updateUserStatus(u.userId, "reactivate")}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Réactiver
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-6 flex gap-2 justify-center">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ← Précédent
          </button>
          <span className="text-sm font-semibold self-center">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}
