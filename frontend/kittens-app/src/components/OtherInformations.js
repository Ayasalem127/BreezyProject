'use client';
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
export default function OtherInformations({ userId }) {
    const infos = ["username", "/logo.webp", "Description"];
    const [subscribe, setSubscribe] = useState(false);



     const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/user/api/users/${userId}`);
        setProfile(res.data);
      } catch (err) {
        console.log("Erreur lors du chargement du profil :", err.message);
        setError("Impossible de charger le profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

     const handleFollow = async () => {
  try {
    const response = await axios.post(
      'http://localhost:3001/user/api/users/follow',
      { followerId:profile?.userId }, 
      {
        withCredentials: true,
      }
    );
    console.log(response.data.message);
  } catch (error) {
    console.error('Erreur lors du follow :', error.response?.data || error.message);
  }
};


  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;


    return (
        <div className="flex items-center justify-center mb-10">
            <div className="w-full sm:w-[calc(50%-0.5rem)] p-2 mt-4 box-border flex flex-col justify-between rounded-lg space-y-2">

                <img src={`http://localhost:3001${profile?.avatarUrl}`} alt="logo" className="w-50 h-50 object-contain mb-2 rounded-full mx-auto"/>
                <span className="font-semibold">{profile.displayName}</span>
                <textarea readOnly type="text" id="description" value={profile.bio} className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"/>

                <div className="flex justify-end">
                    <div className="w-50">
                        <button onClick={(e) => handleFollow(e)}>{subscribe ? "Ne plus suivre" : "Suivre"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}