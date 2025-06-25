'use client';

import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";

export default function UsersSuggestionMobile() {
    //const users = [["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"]];

    const [translatedText, setTranslatedText] = useState("Suggestions de suivi");

    const { user,setUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        axios.get(`http://localhost:3001/user/api/users/suggestions`, { withCredentials: true })
            .then(res => {
                setUsers(res.data);
               
            })
            .catch(err => console.error(err));
    }, [user]);

    const translate = async (texts) => {
        try {
        await new Promise((resolve) => setTimeout(resolve, 200));
        
        const res = await axios.post('http://localhost:3001/language/language/translate', {texts}, { withCredentials: true });
        console.log(res.data);
        setTranslatedText(res.data.messages);
        
        } catch (error) {
        console.error("Erreur : ", error);
        }
    }

    useEffect(() => {
        translate("Suggestions de suivi");
    }, []);

    return (
        <div>
            <h2>{translatedText}</h2>
            <div className="flex flex-col items-center w-full px-4">
                {users.map((user, index) => (
                <div key={index} style={{ boxShadow: "0 12px 32px var(--shadow-color)", borderColor: 'var(--input-border)' }} className="w-full p-2 m-4 box-border flex flex-col justify-between border rounded-2xl">
                        <Link href={"/otherProfile"}>
                            <div className="p-2 box-border flex flex-row items-center justify-center rounded-lg gap-4">
                                <img src={user?.avatarUrl
                                    ? `http://localhost:3001${user.avatarUrl}`
                                    : "/avatarcat.jpg"} alt="photo de profil" className="w-10 h-10 object-contain rounded-full"/>
                                <span className="font-semibold">{user.displayName}</span>
                            </div>
                        </Link>
                </div>
                ))}
            </div>
        </div>
    );
}