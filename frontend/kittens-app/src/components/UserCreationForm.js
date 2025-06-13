'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

export default function UserCreationForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const isValidPassword = (pwd) => {
    if (!pwd) return "Mot de passe requis.";
    if (pwd.length < 6 || !/\d/.test(pwd)) {
      return "Mot de passe invalide.";
    }
    return "";
  };

  useEffect(() => {
    setPasswordError(isValidPassword(password));

    // validation du champ de confirmation
    if (!confirmPassword) {
      setConfirmError("Confirmation requise.");
    } else if (confirmPassword !== password) {
      setConfirmError("Le mot de passe ne correspond pas.");
    } else {
      setConfirmError("");
    }
  }, [password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const pwdError = isValidPassword(password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    if (!confirmPassword || confirmPassword !== password) {
      setConfirmError("Le mot de passe ne correspond pas.");
      return;
    }

    setPasswordError("");
    setConfirmError("");

    console.log("Email:", email);
    console.log("Username:", username);
    console.log("Mot de passe:", password);
    console.log("Confirmation:", confirmPassword);

    router.push("/");
  };

  const inputBase = "bg-white mt-1 block w-full rounded-md p-2 focus:outline-none focus:border-blue-500";

  return (
    <div className="flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="p-4 rounded-lg w-full max-w-sm space-y-6">

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputBase} border border-black`}
            placeholder="exemple@domaine.com"
          />
        </div>

        {/* Nom d'utilisateur */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`${inputBase} border border-black`}
          />
        </div>

        {/* Mot de passe + icône info */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputBase} pr-10 border ${passwordError ? "border-red-500" : "border-black"}`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 group cursor-pointer">
              <AiOutlineInfoCircle className="text-xl" />
              <span className="absolute hidden group-hover:block text-white bg-black text-xs p-1 rounded w-48 right-6 top-6 z-10">
                6 caractères minimum dont 1 chiffre
              </span>
            </div>
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
        </div>

        {/* Confirmation mot de passe + icône info */}
        <div>
          <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Confirmation du mot de passe</label>
          <div className="relative">
            <input
              type="password"
              id="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputBase} pr-10 border ${confirmError ? "border-red-500" : "border-black"}`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 group cursor-pointer">
              <AiOutlineInfoCircle className="text-xl" />
              <span className="absolute hidden group-hover:block text-white bg-black text-xs p-1 rounded w-48 right-6 top-6 z-10">
                Doit être identique au mot de passe
              </span>
            </div>
          </div>
          {confirmError && (
            <p className="text-red-500 text-sm mt-1">{confirmError}</p>
          )}
        </div>

        {/* Bouton */}
        <button
          type="submit"
        >
          Créer un compte
        </button>
      </form>
    </div>
  );
}