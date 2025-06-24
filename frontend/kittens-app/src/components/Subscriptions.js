'use client';

import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function Subscriptions({ searchText }) {
  const { user } = useContext(AuthContext);
  const userId = user?._id;

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [translatedTexts, setTranslatedTexts] = useState([]);

    const textsToTranslate = ["Mes abonnements", "Chargement...", "Erreur : ", "Aucun abonnement trouvé."];

    const translateMany = async (texts) => {
        try {
            const results = [];

            for (const text of texts) {
                const res = await axios.post(
                    'http://localhost:3001/language/language/translate',
                    { text },
                    { withCredentials: true }
                );

                results.push(res.data.message);
            }

            setTranslatedTexts(results);
        } catch (error) {
            console.error("Erreur de traduction :", error);
        }
    };

    useEffect(() => {
        translateMany(textsToTranslate);
    }, []);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:3001/user/api/users/${userId}/following`, { withCredentials: true })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setSubscriptions(res.data);
        } else {
          console.warn("res.data is not an array:", res.data);
          setSubscriptions([]);
        }
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.error(err);
          setError(err.message || "Erreur inconnue");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);
 const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.displayName.toLowerCase().includes(searchText.toLowerCase())
  );
  return (
    <div>
      <h2>{translatedTexts[0]}</h2>


      <div className="flex flex-col items-center w-full px-4">
        {loading ? (
          <p className="text-gray-500">{translatedTexts[1]}</p>
        ) : error ? (
          <p className="text-red-500">{translatedTexts[2]} {error}</p>
        ) : filteredSubscriptions.length > 0 ? (
          filteredSubscriptions.map((subscription, index) => (
            <div
              key={index}
              style={{ boxShadow: "0 12px 32px var(--shadow-color)", borderColor: 'var(--input-border)' }} className="w-full sm:w-[calc(50%-0.5rem)] p-2 m-4 box-border flex flex-col justify-between border rounded-2xl">
                     
              <Link href={`/otherProfile?userId=${subscription.userId}`} >
                <div className="p-2 box-border flex flex-row items-center justify-center rounded-lg gap-4">
                  <img
                    src={`http://localhost:3001${subscription?.avatarUrl}`|| "/avatarcat.jpg"}
                    alt="photo de profil"
                    className="w-10 h-10 object-contain rounded-full"
                  />
                  <span className="font-semibold">{subscription.displayName}</span>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">{translatedTexts[3]}</p>
        )}
      </div>
    </div>
  );
}
