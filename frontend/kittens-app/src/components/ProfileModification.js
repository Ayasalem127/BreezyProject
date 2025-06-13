'use client';

import { useState, useRef, useEffect } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';

export default function ProfilModification() {
  const infos = ["username", "/logo.webp", "Description"];
  const [image, setImage] = useState(infos[1]);
  const fileInputRef = useRef(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const isValidPassword = (pwd) => {
    if (!pwd) return "Mot de passe requis.";
    if (pwd.length < 6 || !/\d/.test(pwd)) {
      return "Mot de passe invalide.";
    }
    return "";
  };

useEffect(() => {
  if (formSubmitted || password.length > 0 || confirmPassword.length > 0) {
    setPasswordError(isValidPassword(password));

    if (!confirmPassword) {
      setConfirmError("Confirmation requise.");
    } else if (confirmPassword !== password) {
      setConfirmError("Le mot de passe ne correspond pas.");
    } else {
      setConfirmError("");
    }
  }
}, [password, confirmPassword, formSubmitted]);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const inputBase = "bg-white mt-1 block w-full rounded-md p-2 focus:outline-none focus:border-blue-500";

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    const pwdError = isValidPassword(password);
    setPasswordError(pwdError);

    if (!confirmPassword || confirmPassword !== password) {
      setConfirmError("Le mot de passe ne correspond pas.");
    } else {
      setConfirmError("");
    }

    if (pwdError || confirmPassword !== password) {
      return; // ne pas soumettre
    }

    const form = e.target;
    const username = form.username.value;
    const email = form.email.value;
    const biography = form.biography.value;

    // Affichage
    console.log(`Username : ${username}`);
    console.log(`Bio : ${biography}`);
    console.log(`Email : ${email}`);
    console.log(`Mot de passe : ${password}`);
    console.log(`Confirmation : ${confirmPassword}`);
    alert("Modifications enregistrées !");
  };

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-4 rounded-lg w-full max-w-sm space-y-6">
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer flex items-center justify-center bg-gray-100"
        >
          <img src={image} alt="Profil" className="object-cover w-full h-full" />
          <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
          <input type="text" id="username" className={`${inputBase} border border-black`} />
        </div>

        <div>
          <label htmlFor="biography" className="block text-sm font-medium text-gray-700">Biographie</label>
          <textarea id="biography" className={`${inputBase} border border-black`} />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
          <input type="email" id="email" placeholder="exemple@domaine.com" className={`${inputBase} border border-black`} />
        </div>

        {/* Mot de passe */}
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

        {/* Confirmation */}
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

        <button type="submit">Modifier</button>
      </form>
    </div>
  );
}