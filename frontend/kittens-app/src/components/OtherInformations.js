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
            <div className="rounded-lg w-full justify-center max-w-sm space-y-2">
                <img src={infos[1]} alt="logo" className="w-50 h-50 object-contain mb-2 rounded-full mx-auto"/>
                <span className="font-semibold">{infos[0]}</span>
                <textarea readOnly type="text" id="description" value={infos[2]} className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"/>
                <button onClick={(e) => handleFollow(e)}>{subscribe ? "Ne plus suivre" : "Suivre"}</button>
            </div>
        </div>
    );
}