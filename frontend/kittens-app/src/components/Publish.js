'use client';

export default function Publish() {
    const photo = "/logo.webp";

    const handleSubmit = async (e) => {
        e.preventDefault();

        const message = e.target.elements.message.value;

        //Affichage temporaire
        console.log(`Message : ${message}`);
    }

    return (
        <div className="flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full sm:w-[calc(50%-0.5rem)] p-2 m-4 box-border flex flex-col justify-between rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                <img src={photo} alt="logo" className="w-10 h-10 object-contain mb-2 rounded-full"/>
                <textarea type="text" id="message" className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none" rows={3} placeholder="Laisse parler ton coeur..."/>
                </div>

                <div className="flex justify-end">
                <div className="w-30">
                <button type="submit">Publier</button>
                </div>
                </div>
            </form>
        </div>
    );
}