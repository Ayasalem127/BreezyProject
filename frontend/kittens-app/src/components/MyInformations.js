'use client';

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
export default function MyInformations() {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    console.log(user)
    const infos = [user.displayName, "/logo.webp", user.bio||"Description"];

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
                <span className="font-semibold">{infos[0]}</span>
                <textarea readOnly type="text" id="description" value={infos[2]} className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"/>
                <button onClick={handleModification}>Modifier mon profil</button>
            </div>
        </div>
    );
}