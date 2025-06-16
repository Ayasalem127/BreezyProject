'use client';

import axios from "axios";

import PopupEmptyFields from "./PopupEmptyFields";
import PopupDifferentPasswords from "./PopupDifferentPasswords";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

export default function UserCreationForm() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [error, setError] = useState('');
  const [showPopupEmpty, setShowPopupEmpty] = useState(false);
  const [showPopupDifferent, setShowPopupDifferent] = useState(false);

  useEffect(() => {
      if (username.trim() === "") {
          setUsernameError(true);
      } else {
          setUsernameError(false);
      }
  }, [username]);
  
  useEffect(() => {
      if (email.trim() === "") {
          setEmailError(true);
      } else {
          setEmailError(false);
      }
  }, [email]);

  const isValidPassword = (pwd) => {
    if (!pwd) return "Mot de passe requis.";
    if (pwd.length < 8 || !/\d/.test(pwd)) {
      return "Mot de passe invalide.";
    }
    return "";
  };

  const validatePassword = (pwd) => {
      const hasMinLength = pwd.length >= 8;
      const hasNumber = /\d/.test(pwd);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
      return hasMinLength && hasNumber && hasSpecialChar;
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
    setError('');

    const usernameEmpty = username.trim() === '';
    const emailEmpty = email.trim() === '';
    const passwordEmpty = password.trim() === '';
    const confirmPasswordEmpty = confirmPassword.trim() === '';

    setEmailError(emailEmpty);
    setUsernameError(usernameEmpty);
    setPasswordError(passwordEmpty ? "Mot de passe requis." : "");
    setConfirmError(confirmPasswordEmpty ? "Confirmation requise." : confirmPassword !== password ? "Le mot de passe ne correspond pas." : "");

    if (!validatePassword(password)) {
        setError(" Le mot de passe doit contenir au moins 8 caractères, un chiffre et un caractère spécial.");
        return;
    }

    if (usernameEmpty || emailEmpty || passwordEmpty || confirmPasswordEmpty) {
      setShowPopupEmpty(true);
      return;
    }

    const pwdError = isValidPassword(password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    if (confirmPassword !== password) {
      setShowPopupDifferent(true);
      setConfirmError("Le mot de passe ne correspond pas.");
      return;
    }

    console.log("Email:", email);
    console.log("Username:", username);
    console.log("Mot de passe:", password);
    console.log("Confirmation:", confirmPassword);

    try {
      const res = await axios.post('http://localhost:3001/auth/auth/register', { username,email, password }, { withCredentials: true } //  pour envoyer/recevoir le cookie
        )
      console.log(`TOKEN : ${res.data.token}`);
      // localStorage.setItem('token', res.data.token)
      router.push("/myProfile");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription.");
    }
  };

  const inputBase = "bg-white mt-1 block w-full rounded-md p-2 focus:outline-none focus:border-blue-500";

  return (
    <div className="flex items-center justify-center p-4">
      {showPopupEmpty && (
      <PopupEmptyFields onClose={() => setShowPopupEmpty(false)} />
      )}

      {showPopupDifferent && (
      <PopupDifferentPasswords onClose={() => setShowPopupDifferent(false)} />
      )}

      <form onSubmit={handleSubmit} className="p-4 rounded-lg w-full max-w-sm space-y-6">
        {error && <p className="text-red-500">{error}</p>}

        {/* Nom d'utilisateur */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`bg-white mt-1 block w-full rounded-md p-2 border ${
                usernameError ? 'border-red-500' : 'border-gray-300'
            } focus:border-blue-500 focus:outline-none`}
          />
          {usernameError && (
              <p className="text-red-500 text-sm mt-1">Un nom d'utilisateur est requis.</p>
          )}
        </div>

        {/* Email */}
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
              <p className="text-red-500 text-sm mt-1">Une adresse email est requise.</p>
          )}
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