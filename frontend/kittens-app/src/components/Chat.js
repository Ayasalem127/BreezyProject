'use client';

import axios from "axios";
import { useState, useEffect, useRef } from "react";

export default function Chat({userId}) {
    //const chats = [["username", "/logo.webp", "Moi", "J'ai envoyé ce message.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.", "01/01/2001"], ["username", "/logo.webp", "Username", "J'ai reçu ce message.", "01/01/2001"], ["username", "/logo.webp", "Moi", "J'ai envoyé ce message.", "01/01/2001"], ["username", "/logo.webp", "Username", "J'ai reçu ce message.", "01/01/2001"], ["username", "/logo.webp", "Moi", "J'ai envoyé ce message.", "01/01/2001"], ["username", "/logo.webp", "Username", "J'ai reçu ce message.", "01/01/2001"], ["username", "/logo.webp", "Moi", "J'ai envoyé ce message.", "01/01/2001"], ["username", "/logo.webp", "Username", "J'ai reçu ce message.", "01/01/2001"]];
    const [chats, setChats] = useState({ messages: [] });
    const containerRef = useRef();

    const getMessages = async (e) => {
        try {
            console.log(userId);
            const res = await axios.get(`http://localhost:3001/messaging/messaging/${userId}`, { withCredentials: true });
            console.log(res.data);
            setChats(res.data);
            
        } catch (error) {
            console.error("Erreur : ", error);
        }
    }

    useEffect(() => {
        getMessages();
    }, [userId]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [chats]);

    return (
        <div ref={containerRef} className="flex flex-col items-center w-full px-4 pb-28 overflow-y-auto max-h-[80vh]">
            {chats.messages.map((chat, index) => {
                const isMe = chat.authorId === chats.meId;
                const displayName = isMe ? chats.meDisplayName : chats.otherDisplayName;
                const avatarUrl = isMe ? chats.meAvatarUrl || "/logo.webp" : chats.otherAvatarUrl || "/logo.webp";

                return (
                    <div key={index} className={`w-full sm:w-[calc(50%-0.5rem)] m-2 flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end text-right" : "items-start text-left"}`}>
                            <div className={`flex items-center gap-3 ${isMe ? "flex-row-reverse" : "flex-row"} mb-1`}>
                                <img src={avatarUrl} alt="profil" className="w-10 h-10 object-cover rounded-full"/>
                                <p className="font-semibold">{displayName}</p>
                            </div>
                            <div>
                                <p style={{ backgroundColor: 'var(--input-background)', boxShadow: "0 12px 32px var(--shadow-color)", borderColor: 'var(--input-border)' }} className="text-sm break-all whitespace-pre-wrap rounded-xl p-3">{chat.content}</p>
                                <p className="text-right text-xs text-gray-400 mt-1">{chat.createdAt}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}