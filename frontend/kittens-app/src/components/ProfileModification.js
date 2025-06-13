'use client';

import { useState, useRef } from 'react';

export default function ProfilModification() {
    const infos = ["username", "/logo.webp", "Description"];
    const [image, setImage] = useState(infos[1]);
    const fileInputRef = useRef(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        username = e.target.element.username.value;
        email = e.target.element.email.value;
        password = e.target.element.password.value;
        confirm_password = e.target.element.confirm_password.value;
        biography = e.target.element.biography.value;

        //Affichage temporaire
        console.log(`Username : ${username}`);
        console.log(`Bio : ${biography}`);
        console.log(`Email : ${email}`);
        console.log(`Mot de passe : ${password}`);
        console.log(`Confirmation du mot de passe : ${confirm_password}`);
    }

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
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                />
                </div>

                <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                <input type="text" id="username" className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"/>
                </div>

                <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                <textarea readOnly type="text" id="biography" className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"/>
                </div>

                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
                <input type="email" id="email" className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none" placeholder="exemple@domaine.com"/>
                </div>

                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input type="password" id="password" className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"/>
                </div>

                <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Confirmation du mot de passe</label>
                <input type="password" id="confirm_password" className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"/>
                </div>

                <button type="submit">Modifier</button>
            </form>
        </div>
    );
}