'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ConnectionForm() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Affichage temporaire
        console.log(`Email : ${email}`);
        console.log(`Mot de passe : ${password}`);

        try {
            router.push("/home");
        } catch (error) {
            console.error("Erreur : ", error);
        }

    }
    return (
        <div className="flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="p-4 rounded-lg w-full max-w-sm space-y-6">
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
                <input type="email" id="email" className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none" placeholder="exemple@domaine.com"/>
                </div>

                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input type="password" id="password" className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"/>
                </div>

                <button type="submit" style={{ backgroundColor: 'var(--buttons)' }} className="w-full p-2 shadow-md rounded-md cursor-pointer transition">Se connecter</button>
            </form>
        </div>
    );
}