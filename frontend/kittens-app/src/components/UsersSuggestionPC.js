'use client';

import Link from "next/link";
import { useEffect, useState, useContext} from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";

export default function UsersSuggestionPC() {
    //const users = [["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"]];



    
     const { user,setUser } = useContext(AuthContext);
     const [suggestions, setSuggestions] = useState([]);
   
    
    useEffect(() => {
        axios.get(`http://localhost:3001/user/api/users/suggestions`, { withCredentials: true })
            .then(res => {
                setSuggestions(res.data);
               
            })
            .catch(err => console.error(err));
    }, [user]);



    const [translatedText, setTranslatedText] = useState("Suggestions de suivi");

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
        <div className="fixed top-12 left-0 w-1/4">
            <div className="bg-white w-full p-2 rounded-xl overflow-y-auto" style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--input-border)', maxHeight: 'calc(100vh - var(--navbar-height))', minHeight: 'calc(100vh - var(--navbar-height))' }}>
                <h3>{translatedText}</h3>
                {suggestions.map((user, index) => (
                <div key={index} className="w-full p-2 mt-4 box-border border rounded-xl sahdow-xl">
                    <div className="flex items-center gap-3 w-full">
                       <Link
                          href={{
                          pathname: "/otherProfile",
                          query: { userId: user.userId }
                         }}>
                            <div className="box-border flex flex-row items-center justify-center rounded-lg gap-4">
                                <img src={user?.avatarUrl? `http://localhost:3001${user.avatarUrl}` : "/avatarcat.jpg"} alt="photo de profil" className="w-10 h-10 object-contain rounded-full"/>
                                <span className="font-semibold">{user.displayName}</span>
                            </div>
                        </Link>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}