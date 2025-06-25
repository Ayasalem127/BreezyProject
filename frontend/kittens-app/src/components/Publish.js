'use client';

import { Content } from "next/font/google";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";

export default function Publish() {
    const [content, setContent] = useState("");
    const photo = "/";
    const { user } = useContext(AuthContext);

    const [translatedTexts, setTranslatedTexts] = useState([]);

    const textsToTranslate = ["Laisse parler ton coeur...", "Publier"];

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

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        const message = e.target.elements.message.value;
        try {
            const res = await axios.post('http://localhost:3001/post/api/posts', { content:content }, { withCredentials: true } //  pour envoyer/recevoir le cookie
                )
              console.log(`TOKEN : ${res.data.token}`);
           // router.push("/home");
        } catch (error) {
            console.error("Erreur : ", error);
        }
        //Affichage temporaire
        console.log(`Message : ${message}`);
    }
    // Calcul de l'avatar
    const avatarUrl = user?.avatarUrl
        ? `http://localhost:3001${user.avatarUrl}`
        : "/avatarcat.jpg";

    return (
        <div className="flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full sm:w-[calc(50%-0.5rem)] p-2 m-4 box-border flex flex-col justify-between rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                    <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-10 h-10 object-contain mb-2 rounded-full"
                    />
                    <textarea type="text" id="message" className="focus:border-blue-500 focus:outline-none" rows={3} placeholder={translatedTexts[0]} value={content} onChange={(e) => setContent(e.target.value)}/>
                </div>

                <div className="flex justify-end">
                    <div className="w-30">
                        <button type="submit">{translatedTexts[1]}</button>
                    </div>
                </div>
            </form>
        </div>
    );
}