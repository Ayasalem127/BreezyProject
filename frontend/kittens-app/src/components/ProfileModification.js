'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import axios from 'axios';
import { AuthContext } from "@/context/AuthContext";

export default function ProfilModification() {
    // Récupère userId depuis AuthContext
  const infos = ["username", "/avatarcat.jpg", "Description"];
 const { user,setUser } = useContext(AuthContext);
   useEffect(() => {
   setImage(`http://localhost:3001${user?.avatarUrl}` || infos[1])
  }, [user]);

  const fileInputRef = useRef(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [translatedTexts, setTranslatedTexts] = useState([]);

    const textsToTranslate = ["Nom d'utilisateur", "Biographie", "Adresse e-mail", "Mot de passe", "8 caractères minimum dont 1 chiffre", "Confirmation du mot de passe", "Doit être identique au mot de passe", "Modifier"];

    const translateMany = async (texts) => {
        try {
            const res = await axios.post(
                'http://localhost:3001/language/language/translate',
                { texts },
                { withCredentials: true }
            );

            setTranslatedTexts(res.data.messages);
        } catch (error) {
            console.error("Erreur de traduction :", error);
        }
    };

    useEffect(() => {
        translateMany(textsToTranslate);
    }, []);

  const isValidPassword = (pwd) => {
    if (!pwd) return "Mot de passe requis.";
    if (pwd.length < 6 || !/\d/.test(pwd)) {
      return "Mot de passe invalide.";
    }
    return "";
  };
    const [image, setImage] = useState( `http://localhost:3001${user?.avatarUrl}` || infos[1]); 

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


  /*const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const inputBase = "block focus:outline-none focus:border-blue-500";*/

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith("image/")) return;


  // Pour afficher un aperçu immédiatement (facultatif)
  const reader = new FileReader();
  reader.onload = () => setImage(reader.result);
  reader.readAsDataURL(file);

};
  const inputBase = "bg-white mt-1 block w-full rounded-md p-2 focus:outline-none focus:border-blue-500";
const uploadAvatar = async (formData) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/user/api/users/upload-avatar",
      formData,
      {
        withCredentials: true, // pour inclure les cookies
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    console.log("Image uploaded", response.data);
  } catch (error) {
    console.error("Upload error", error);
  }
};
  const handleSubmit = async (e) => {
  e.preventDefault();
  setFormSubmitted(true);

  const file = fileInputRef.current.files[0];
  // const formData = new FormData();
  // formData.append("avatar", file);


  const userId = user?._id; // ou currentUser._id selon ta structure
  console.log(user);
  // Vérification basique
  if (!userId) {
    console.log("Utilisateur non authentifié");
    return;
  }
if (file) {
  const formData = new FormData();
  formData.append("avatar", file);

  try {
    await uploadAvatar(formData);
    console.log("Avatar uploaded successfully.");
  } catch (error) {
    console.error("Erreur lors de l'upload de l'avatar :", error);
  }}
  try {
    // Upload avatar (si géré ailleurs)
   // await uploadAvatar(formData);

    // Récupération des données du formulaire
    const form = e.target;
    const displayName = form.username.value;
    const bio = form.biography.value;

    // Envoi des données au backend via axios
    const res = await axios.put(
      `http://localhost:3001/user/api/users/${userId}`,
      { displayName, bio },
      { withCredentials: true } // important si cookies d'auth
    );

    console.log("Profil mis à jour :", res.data);
    const updatedUser = res.data;

    // ✅ Met à jour le contexte global avec les nouvelles infos
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUser
    }))
    alert("Modifications enregistrées !");
  } catch (error) {
    console.log("Erreur lors de la mise à jour :", error.response?.data || error.message);
    //alert("Erreur lors de la mise à jour du profil");
  }
};
  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-4 rounded-lg w-full max-w-sm space-y-6">
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--input-border)' }}
          className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 cursor-pointer"
        >
          <img src={image} alt="Profil" className="object-cover w-full h-full" />
          <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
        </div>

        <div>
          <label htmlFor="username">{translatedTexts[0]}</label>
          <input type="text" id="username" className={`${inputBase}`} defaultValue={user?.displayName}/>
        </div>

        <div>
          <label htmlFor="biography">{translatedTexts[1]}</label>
          <textarea id="biography" className={`${inputBase}`} defaultValue={user?.bio}/>

        </div>

        {/* <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
          <input type="email" id="email" placeholder="exemple@domaine.com"  className={`${inputBase}`} />
        </div>

       
        <div>
          <label htmlFor="password">{translatedTexts[3]}</label>
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputBase} pr-10 ${passwordError ? "border-red-500" : "border-black"}`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 group cursor-pointer">
              <AiOutlineInfoCircle className="text-xl" />
              <span className="absolute hidden group-hover:block text-white bg-black text-xs p-1 rounded w-48 right-6 top-6 z-10">
                {translatedTexts[4]}
              </span>
            </div>
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
        </div>

     
        <div>
          <label htmlFor="confirm_password">{translatedTexts[5]}</label>
          <div className="relative">
            <input
              type="password"
              id="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputBase} pr-10 ${confirmError ? "border-red-500" : "border-black"}`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 group cursor-pointer">
              <AiOutlineInfoCircle className="text-xl" />
              <span className="absolute hidden group-hover:block text-white bg-black text-xs p-1 rounded w-48 right-6 top-6 z-10">
                {translatedTexts[6]}
              </span>
            </div>
          </div>
          {confirmError && (
            <p className="text-red-500 text-sm mt-1">{confirmError}</p>
          )}
        </div> */}

        <button type="submit">{translatedTexts[7]}</button>
      </form>
    </div>
  );
}