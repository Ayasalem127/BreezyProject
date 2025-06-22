'use client';
import { useState } from "react";

export default function OtherInformations() {
    const infos = ["username", "/logo.webp", "Description"];
    const [subscribe, setSubscribe] = useState(false);

    function handleFollow() {
        const newSubscribe = !subscribe;
        setSubscribe(newSubscribe);

        if (newSubscribe) {
            console.log("Utilisateur suivi.");
        } else {
            console.log("Utilisateur non suivi.");
        }
    }

    return (
        <div className="flex items-center justify-center mb-10">
            <div className="w-full sm:w-[calc(50%-0.5rem)] p-2 mt-4 box-border flex flex-col justify-between rounded-lg space-y-2">
                <img src={infos[1]} alt="logo" className="w-50 h-50 object-contain mb-2 rounded-full mx-auto"/>
                <span className="font-semibold">{infos[0]}</span>
                <textarea readOnly type="text" id="description" value={infos[2]} className="focus:border-blue-500 focus:outline-none"/>
                <div className="flex justify-end">
                    <div className="w-50">
                        <button onClick={(e) => handleFollow(e)}>{subscribe ? "Ne plus suivre" : "Suivre"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}