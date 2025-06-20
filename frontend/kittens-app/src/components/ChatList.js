'use client';
import Link from "next/link";

function truncate(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export default function ChatList() {
    const chats = [["username", "/logo.webp", "Moi", "J'ai envoyé ce message.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "01/01/2001"], ["username", "/logo.webp", "Username", "J'ai reçu ce message.", "01/01/2001"], ["username", "/logo.webp", "Moi", "J'ai envoyé ce message.", "01/01/2001"], ["username", "/logo.webp", "Username", "J'ai reçu ce message.", "01/01/2001"], ["username", "/logo.webp", "Moi", "J'ai envoyé ce message.", "01/01/2001"], ["username", "/logo.webp", "Username", "J'ai reçu ce message.", "01/01/2001"], ["username", "/logo.webp", "Moi", "J'ai envoyé ce message.", "01/01/2001"], ["username", "/logo.webp", "Username", "J'ai reçu ce message.", "01/01/2001"]];
    
    return (
        <div>
            <div className="flex flex-col items-center w-full px-4">
                {chats.map((chat, index) => (
                    <div key={index} className="w-full sm:w-[calc(50%-0.5rem)] p-2 m-4 box-border flex flex-col justify-between border border-gray-500 rounded-2xl shadow-2xl">
                        <Link href={"/chat"}>
                            <div className="p-2 ml-10 box-border flex flex-row items-center justify-start rounded-lg gap-4">
                                <img src={chat[1]} alt="photo de profil" className="w-10 h-10 object-contain rounded-full"/>
                                <span className="font-semibold">{chat[0]}</span>
                            </div>
                            <div className="p-2 mr-10 box-border flex flex-row items-center justify-end rounded-lg gap-4">
                                <p>{chat[2]}</p>
                                <p>{truncate(chat[3], 50)}</p>
                                <p>{chat[4]}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}