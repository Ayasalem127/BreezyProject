'use client';

import { useState, useEffect } from "react";
import axios from "axios";

export default function Publish() {
    const photo = "/logo.webp";

    const [translatedTexts, setTranslatedTexts] = useState([]);

    const textsToTranslate = ["Laisse parler ton coeur...", "Publier"];

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

                await new Promise((resolve) => setTimeout(resolve, 200));
            }

            setTranslatedTexts(results);
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

        //Affichage temporaire
        console.log(`Message : ${message}`);
    }

    return (
        <div className="flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full sm:w-[calc(50%-0.5rem)] p-2 m-4 box-border flex flex-col justify-between rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                    <img src={photo} alt="logo" className="w-10 h-10 object-contain mb-2 rounded-full"/>
                    <textarea type="text" id="message" className="focus:border-blue-500 focus:outline-none" rows={3} placeholder={translatedTexts[0]}/>
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