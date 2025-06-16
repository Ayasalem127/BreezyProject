'use client';

import PopupEmptyFields from "./PopupEmptyFields";
import PopupWrongCredentials from "./PopupWrongCredentials";

import { useRouter } from "next/navigation";

import { useState } from "react";
import axios from "axios";

import { useState, useEffect } from "react";

export default function ConnectionForm() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(true);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(true);
    const [showPopupEmpty, setShowPopupEmpty] = useState(false);
    const [showPopupWrong, setShowPopupWrong] = useState(false);

    // Détection en temps réel du champ vide
    useEffect(() => {
        if (password.trim() === "") {
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
    }, [password]);

    useEffect(() => {
        if (email.trim() === "") {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    }, [email]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailEmpty = email.trim() === '';
        const passwordEmpty = password.trim() === '';

        setEmailError(emailEmpty);
        setPasswordError(passwordEmpty);

        if (emailEmpty || passwordEmpty) {
            setShowPopupEmpty(true);
            return;
        } else if (password.trim() === "a") {
            setShowPopupWrong(true);
            return;
        }

        console.log(`Email : ${email}`);
        console.log(`Mot de passe : ${password}`);

        try {
            const res = await axios.post('http://localhost:3001/auth/auth/login', { email, password }, { withCredentials: true } //  pour envoyer/recevoir le cookie
                )
              console.log(`TOKEN : ${res.data.token}`);
            router.push("/home");
        } catch (error) {
            console.error("Erreur : ", error);
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            {showPopupEmpty && (
            <PopupEmptyFields onClose={() => setShowPopupEmpty(false)} />
            )}

            {showPopupWrong && (
            <PopupWrongCredentials onClose={() => setShowPopupWrong(false)} />
            )}

            <form onSubmit={handleSubmit} className="p-4 rounded-lg w-full max-w-sm space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`bg-white mt-1 block w-full rounded-md p-2 border ${
                            emailError ? 'border-red-500' : 'border-gray-300'
                        } focus:border-blue-500 focus:outline-none`}
                        placeholder="exemple@domaine.com"
                    />
                    {emailError && (
                        <p className="text-red-500 text-sm mt-1">L'adresse email est requise.</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`bg-white mt-1 block w-full rounded-md p-2 border ${
                            passwordError ? 'border-red-500' : 'border-gray-300'
                        } focus:border-blue-500 focus:outline-none`}
                    />
                    {passwordError && (
                        <p className="text-red-500 text-sm mt-1">Le mot de passe est requis.</p>
                    )}
                </div>

                <button
                    type="submit"
                >
                    Se connecter
                </button>
            </form>
        </div>
    );
}
