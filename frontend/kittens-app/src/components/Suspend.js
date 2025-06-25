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

  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [suspendDuration, setSuspendDuration] = useState("");
  const [suspendUnit, setSuspendUnit] = useState("m");

  const [translatedTexts, setTranslatedTexts] = useState([]);

  const textsToTranslate = [
  "Modération des utilisateurs",
  "Chargement...",
  "Aucun utilisateur trouvé.",
  "Status",
  "Suspendre",
  "Bannir",
  "Réactiver",
  "Précédent",
  "Suivant",
  "Page",
  "Durée de la suspension",
  "Durée",
  "minutes",
  "heures",
  "jours",
  "Annuler",
  "Confirmer"
];

  const translateMany = async (texts) => {
      try {
          const res = await axios.post(
              'http://localhost:3001/language/language/translate',
              { texts },
              { withCredentials: true }
          );

          setTranslatedTexts(res.data.messages);
      } catch (error) {
          console.error("Erreur de traduction :", error);
      }
  };

  useEffect(() => {
      translateMany(textsToTranslate);
  }, []);


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

  const updateUserStatus = async (userId, action, duration = null) => {
    try {
      const body = duration ? { duration } : {};
      await axios.post(
        `http://localhost:3001/user/api/users/${userId}/${action}`,
        body,
        { withCredentials: true }
      );

      setAllUsers(prev =>
        prev.map(u =>
          u.userId === userId
            ? { ...u, status: action === "reactivate" ? "active" : action === "ban" ? "banned" : "suspended" }
            : u
        )
      );
    } catch (err) {
      console.log(`❌ Erreur lors de l'action ${action} :`, err.response?.data || err.message);
    }
  };

  return (
    <div className="px-4 py-6">
      <h2>{translatedTexts[0]}</h2>

      {loading ? (
        <p>{translatedTexts[1]}</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-col items-center w-full">
          {filteredUsers.length === 0 ? (
            <p className="text-gray-500">{translatedTexts[2]}</p>
          ) : (
            filteredUsers.map((u, index) => (
              <div
                key={index}
                className="w-full sm:w-[calc(50%-0.5rem)] p-4 m-4 border rounded-2xl shadow flex flex-col gap-2"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`http://localhost:3001${u.avatarUrl || "/avatarcat.jpg"}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{u.displayName}</p>
                    <p className="text-sm text-gray-600">{translatedTexts[3]} : {u.status}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  {u.status !== "banned" && u.status !== "suspended" && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedUserId(u.userId);
                          setShowSuspendModal(true);
                        }}
                      >
                        {translatedTexts[4]}
                      </button>
                      <button
                        onClick={() => updateUserStatus(u.userId, "ban")}
                      >
                        {translatedTexts[5]}
                      </button>
                    </>
                  )}
                  {(u.status === "suspended" || u.status === "banned") && (
                    <button
                      onClick={() => updateUserStatus(u.userId, "reactivate")}
                    >
                      {translatedTexts[6]}
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
          >
            ← {translatedTexts[7]}
          </button>
          <span className="text-sm font-semibold self-center">
            {translatedTexts[9]} {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            {translatedTexts[8]} →
          </button>
        </div>
      )}

      {showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[90%] sm:w-96">
            <h3>{translatedTexts[10]}</h3>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="number"
                value={suspendDuration}
                onChange={(e) => setSuspendDuration(e.target.value)}
                placeholder={translatedTexts[11]}
                min="1"
              />
              <select
                value={suspendUnit}
                onChange={(e) => setSuspendUnit(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="m">{translatedTexts[12]}</option>
                <option value="h">{translatedTexts[13]}</option>
                <option value="d">{translatedTexts[14]}</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                {translatedTexts[15]}
              </button>
              <button
                onClick={async () => {
                  const durationString = `${suspendDuration}${suspendUnit}`;
                  await updateUserStatus(selectedUserId, "suspend", durationString);
                  setShowSuspendModal(false);
                  setSuspendDuration("");
                  setSuspendUnit("m");
                }}
              >
                {translatedTexts[16]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
