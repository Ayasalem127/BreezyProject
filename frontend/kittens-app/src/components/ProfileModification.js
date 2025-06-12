'use client';

export default function ProfilModification() {
    const infos = ["username", "/logo.webp", "Description"];

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
                <img src={infos[1]} alt="logo" className="w-50 h-50 object-contain mb-2 rounded-full mx-auto"/>

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

                <button type="submit" style={{ backgroundColor: 'var(--buttons)' }} className="w-full p-2 shadow-md rounded-md cursor-pointer transition">Modifier</button>
            </form>
        </div>
    );
}