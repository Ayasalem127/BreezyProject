'use client';

import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";

export default function OtherInformations({ userId }) {
    const { user,setUser } = useContext(AuthContext);
    const infos = ["username", "/logo.webp", "Description"];
    const [subscribe, setSubscribe] = useState(user?.following?.includes(userId) );

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [translatedTexts, setTranslatedTexts] = useState([]);

    const textsToTranslate = ["Suivre", "Ne plus suivre"];

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


    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/user/api/users/${userId}`, {
  withCredentials: true,
});
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
    setSubscribe(!subscribe);
    if(user.following?.includes(userId))
    {
   const response = await axios.post(
      'http://localhost:3001/user/api/users/unfollow',
      { followerId:profile?.userId }, 
      {
        withCredentials: true,
      }
    );
    console.log(response.data.message);
    }
    else{
   const response = await axios.post(
      'http://localhost:3001/user/api/users/follow',
      { followerId:profile?.userId }, 
      {
        withCredentials: true,
      }
    );
    console.log(response.data.message);
    }
const updatedUser = await axios.get('http://localhost:3001/user/api/users/me', {
        withCredentials: true,
      });
      setUser(updatedUser.data);
  } catch (error) {
    console.log('Erreur lors du follow :', error.response?.data || error.message);
  }
};
console.log("useridddddd",userId);


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
                        <button onClick={(e) => handleFollow(e)}>{subscribe ? translatedTexts[1] : translatedTexts[0]}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}