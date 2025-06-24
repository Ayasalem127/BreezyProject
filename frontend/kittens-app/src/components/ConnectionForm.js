'use client';

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { AuthContext } from "@/context/AuthContext";
import PopupEmptyFields from "./PopupEmptyFields";
import PopupWrongCredentials from "./PopupWrongCredentials";


export default function ConnectionForm() {
  const router = useRouter();
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(true);
  const [showPopupEmpty, setShowPopupEmpty] = useState(false);
  const [showPopupWrong, setShowPopupWrong] = useState(false);

  // Mise à jour des erreurs à chaque frappe
  useEffect(() => {
    setEmailError(email.trim() === '');
  }, [email]);

  useEffect(() => {
    setPasswordError(password.trim() === '');
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailEmpty = email.trim() === '';
    const passwordEmpty = password.trim() === '';

    setEmailError(emailEmpty);
    setPasswordError(passwordEmpty);

    if (emailEmpty || passwordEmpty) {
      setShowPopupEmpty(true);
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:3001/auth/auth/login',
        { email, password },
        { withCredentials: true }
      );

      setUser(res.data.user);
      router.push("/home");

    } catch (error) {
      console.error("Erreur : ", error);

      if (error.response?.data?.error === "Identifiants invalides") {
        setShowPopupWrong(true);
        setTimeout(() => {
          setShowPopupWrong(false);
        }, 3000);
      } else {
        alert("Erreur inattendue. Veuillez réessayer.");
      }
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

      <form onSubmit={handleSubmit} className="p-4 rounded-lg w-full max-w-sm space-y-6 bg-white shadow">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full mt-1 p-2 border rounded ${emailError ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none`}
            placeholder="exemple@domaine.com"
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">L'adresse email est requise.</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full mt-1 p-2 border rounded ${passwordError ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none`}
            placeholder="••••••••"
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">Le mot de passe est requis.</p>
          )}
        </div>

        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition">
          Se connecter
        </button>
      </form>
    </div>
  );
}
