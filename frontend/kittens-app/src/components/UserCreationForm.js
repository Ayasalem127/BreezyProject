'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
export default function UserCreationForm() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
        const [error, setError] = useState('');

    const validatePassword = (pwd) => {
        const hasMinLength = pwd.length >= 8;
        const hasNumber = /\d/.test(pwd);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
        return hasMinLength && hasNumber && hasSpecialChar;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        //Affichage temporaire
        console.log(`Email : ${email}`);
        console.log(`Mot de passe : ${password}`);
        if (password !== confirmPassword) {
            setError(" Les mots de passe ne correspondent pas.");
            return;
        }
          if (!validatePassword(password)) {
            setError(" Le mot de passe doit contenir au moins 8 caractères, un chiffre et un caractère spécial.");
            return;
        }
        try {
             const res = await axios.post('http://localhost:3001/auth/auth/register', { username,email, password }, { withCredentials: true } //  pour envoyer/recevoir le cookie
                )
              console.log(`TOKEN : ${res.data.token}`);
            // localStorage.setItem('token', res.data.token)
           router.push("/myProfile");
        } catch (err) {
             setError(err.response?.data?.error || "Erreur lors de l'inscription.");
        }

    }

    return (
        <div className="flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="p-4 rounded-lg w-full max-w-sm space-y-6">
                   {error && <p className="text-red-500">{error}</p>}
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
                <input type="email" id="email" className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none" placeholder="exemple@domaine.com"   value={email}
          onChange={e => setEmail(e.target.value)}
          required/>
                </div>

                <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                <input type="text" id="username" className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"   value={username}
          onChange={e => setUsername(e.target.value)}
          required/>
                </div>

                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input type="password" id="password" className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"   value={password}
          onChange={e => setPassword(e.target.value)}
          required/>
                </div>

                <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Confirmation du mot de passe</label>
                <input type="password" id="confirm_password" className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"  value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required/>
                </div>

                <button type="submit" style={{ backgroundColor: 'var(--buttons)' }} className="w-full p-2 shadow-md rounded-md cursor-pointer transition">Créer un compte</button>
            </form>
        </div>
    );
}