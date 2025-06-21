import axios from "axios";

export default function Chat() {
    const chats = [["username", "/logo.webp", "Moi", "J'ai envoyé ce message.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.", "01/01/2001"], ["username", "/logo.webp", "Username", "J'ai reçu ce message.", "01/01/2001"], ["username", "/logo.webp", "Moi", "J'ai envoyé ce message.", "01/01/2001"], ["username", "/logo.webp", "Username", "J'ai reçu ce message.", "01/01/2001"], ["username", "/logo.webp", "Moi", "J'ai envoyé ce message.", "01/01/2001"], ["username", "/logo.webp", "Username", "J'ai reçu ce message.", "01/01/2001"], ["username", "/logo.webp", "Moi", "J'ai envoyé ce message.", "01/01/2001"], ["username", "/logo.webp", "Username", "J'ai reçu ce message.", "01/01/2001"]];

    return (
        <div className="flex flex-col items-center w-full px-4 pb-28">
            {chats.map((chat, index) => {
                const isMe = chat[2] === "Moi";

                return (
                    <div key={index} className={`w-full sm:w-[calc(50%-0.5rem)] m-2 flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end text-right" : "items-start text-left"}`}>
                            <div className={`flex items-center gap-3 ${isMe ? "flex-row-reverse" : "flex-row"} mb-1`}>
                                <img src={chat[1]} alt="profil" className="w-10 h-10 object-cover rounded-full"/>
                                <p className="font-semibold">{chat[0]}</p>
                            </div>
                            <div>
                                <p className="text-sm break-all whitespace-pre-wrap bg-white rounded-xl shadow-md p-3">{chat[3]}</p>
                                <p className="text-right text-xs text-gray-400 mt-1">{chat[4]}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}