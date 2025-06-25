'use client';
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

function truncate(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export default function ChatList() {
    //const chats = [["username", "/logo.webp", "Moi", "J'ai envoyé ce message.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "01/01/2001"], ["username", "/logo.webp", "Username", "J'ai reçu ce message.", "01/01/2001"], ["username", "/logo.webp", "Moi", "J'ai envoyé ce message.", "01/01/2001"], ["username", "/logo.webp", "Username", "J'ai reçu ce message.", "01/01/2001"], ["username", "/logo.webp", "Moi", "J'ai envoyé ce message.", "01/01/2001"], ["username", "/logo.webp", "Username", "J'ai reçu ce message.", "01/01/2001"], ["username", "/logo.webp", "Moi", "J'ai envoyé ce message.", "01/01/2001"], ["username", "/logo.webp", "Username", "J'ai reçu ce message.", "01/01/2001"]];
    const [chats, setChats] = useState([]);

    const getChats = async (e) => {
        try {
            const res = await axios.get('http://localhost:3001/messaging/messaging/chats', { withCredentials: true });
            console.log(res.data);
            setChats(res.data);

        } catch (error) {
            console.error("Erreur : ", error);
        }
    }

    useEffect(() => {
        getChats();
    }, []);
console.log(chats);
    return (
        <div>
            <div className="flex flex-col items-center w-full px-4">
                {chats.map((chat, index) => (
                    <div key={index} style={{ boxShadow: "0 12px 32px var(--shadow-color)", borderColor: 'var(--input-border)' }} className="w-full sm:w-[calc(50%-0.5rem)] p-2 m-4 box-border flex flex-col justify-between border rounded-2xl">
                        <Link href={`/chat/${chat.otherUser.userId}`}>
                            <div className="p-2 ml-10 box-border flex flex-row items-center justify-start rounded-lg gap-4">
                                <img src={chat.otherUser.avatarUrl || "/avatarcat.jpg"} alt="photo de profil" className="w-10 h-10 object-contain rounded-full"/>
                                <span className="font-semibold">{chat.otherUser.displayName}</span>
                            </div>
                            <div className="p-2 mr-10 box-border flex flex-row items-center justify-end rounded-lg gap-4">
                                <p>{chat.authorId === chat.otherUser.userId ? chat.otherUser.displayName : "Moi"}</p>
                                <p>{truncate(chat.content, 50)}</p>
                                <p>{new Date(chat.createdAt).toLocaleDateString()}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}