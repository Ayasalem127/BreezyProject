'use client';

import { useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";

export default function MyInformations() {
    const router = useRouter();
    
    const { user } = useContext(AuthContext);
  
    console.log(user)
    const infos = [user?.displayName || "username", user?.avatarUrl ? `http://localhost:3001${user.avatarUrl}` : "/avatarcat.jpg", user?.bio || "Description"];

    const [translatedText, setTranslatedText] = useState("Modifier mon profil");

    const translate = async (texts) => {
        try {
        await new Promise((resolve) => setTimeout(resolve, 200));

        const res = await axios.post('http://localhost:3001/language/language/translate', {texts}, { withCredentials: true });
        console.log(res.data);
        setTranslatedText(res.data.messages);

        } catch (error) {
        console.error("Erreur : ", error);
        }
    }

    useEffect(() => {
        
        translate("Modifier mon profil");
    }, []);

    function handleModification() {
        try {
            router.push("/profileModification");
        } catch (error) {
            console.error("Erreur : ", error);
        }
    }

    return (
        <div className="flex items-center justify-center">
            <div className="w-full sm:w-[calc(50%-0.5rem)] p-2 mt-4 box-border flex flex-col justify-between rounded-lg space-y-2">
                <img src={infos[1]} alt="logo" className="w-50 h-50 object-contain mb-2 rounded-full mx-auto"/>
                <span className="font-semibold">{user?.displayName}</span>
                <textarea readOnly type="text" id="description" value={infos[2]} className="focus:border-blue-500 focus:outline-none"/>
                <button onClick={handleModification}>{translatedText}</button>
            </div>
        </div>
    );
}