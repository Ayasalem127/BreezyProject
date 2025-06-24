'use client';
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

export default function MyMessages() {
    const messages = [["username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 1], ["username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 1]];
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState(Array(messages.length).fill(false));
    const [isVisible, setIsVisible] = useState(Array(messages.length).fill(false));
    const [messageTexts, setMessageTexts] = useState(messages.map(message => message[3]));

    const [translatedTexts, setTranslatedTexts] = useState([]);

    const textsToTranslate = ["Mes posts", "Modifier", "Laisse parler ton coeur...", "Publier"];

    const translateMany = async (texts) => {
        try {
            const results = [];

            for (const text of texts) {
                const res = await axios.post(
                    'http://localhost:3001/language/language/translate',
                    { text },
                    { withCredentials: true }
                );

                results.push(res.data.message);
            }

            setTranslatedTexts(results);
        } catch (error) {
            console.error("Erreur de traduction :", error);
        }
    };

    useEffect(() => {
        translateMany(textsToTranslate);
    }, []);
    
    useEffect(() => {
        axios.get('http://localhost:3001/post/api/posts/me', { withCredentials: true })
            .then(res => {
                setPosts(res.data);
                setLikes(res.data.map(() => false)); // par défaut, pas liké
                setIsVisible(res.data.map(() => false)); // réponses cachées
                setMessageTexts(res.data.map(p => p.content)); // contenu des posts
            })
            .catch(err => console.error(err));
    }, []);
    function toggleLike(index) {
        const newLikes = [...likes];
        newLikes[index] = !newLikes[index];
        setLikes(newLikes);
    }

    function toggleResponse(index) {
        const newIsVisible = [...isVisible];
        newIsVisible[index] = !newIsVisible[index];
        setIsVisible(newIsVisible);
    }

    const handleModification = (e, index) => {
        e.preventDefault();

        const newContent = messageTexts[index];
        
        console.log(`Message modifié : ${newContent}`);
    };

    const handleResponse = async (e, index) => {
        e.preventDefault();

        const response = e.target.elements[`response-${index}`].value;

        //Affichage temporaire
        console.log(`Réponse : ${response}`);
    }

    return (
        <div>
            <h2>{translatedTexts[0]}</h2>
        
            <div className="flex flex-col items-center w-full px-4">
                {messages.map((message, index) => (
                <div key={index} style={{ boxShadow: "0 12px 32px var(--shadow-color)", borderColor: 'var(--input-border)' }} className="w-full sm:w-[calc(50%-0.5rem)] p-2 m-4 box-border flex flex-col justify-between border rounded-2xl">
                    <form onSubmit={(e) => handleModification(e, index)} className="rounded-lg w-full space-y-2">
                        <div className="flex items-center gap-3 w-full">
                            <img src={message[1]} alt="logo" className="w-10 h-10 object-contain mb-2 rounded-full"/>
                            <span className="font-semibold">{message[0]}</span>
                            <span className="flex ml-auto text-sm text-gray-500">{message[2]}</span>
                        </div>

                        <textarea id={`message-${index}`} value={messageTexts[index]} onChange={(e) => { const newTexts = [...messageTexts]; newTexts[index] = e.target.value; setMessageTexts(newTexts); }} rows={3} className="focus:border-blue-500 focus:outline-none"/>
                        
                        <div className="flex justify-start gap-2 mt-3">
                            <div className="flex flex-col items-center">
                                <span id={`likeButton-${index}`} className="text-3xl cursor-pointer" onClick={() => toggleLike(index)} role="button" aria-label="like button">{likes[index] ? "❤️" : "🤍"}</span>
                                <span id={`numberLikes-${index}`}>{message[4]}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span id={`responseButton-${index}`} className="text-3xl cursor-pointer" onClick={() => toggleResponse(index)} role="button" aria-label="response button">💬</span>
                                <span id={`numberResponses-${index}`}>{message[5]}</span>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <div className="w-30">
                                <button type="submit">{translatedTexts[1]}</button>
                            </div>
                        </div>
                    </form>

                    <form onSubmit={(e) => handleResponse(e, index)} style={{display: isVisible[index] ? 'block' : 'none'}} className="rounded-lg w-full space-y-2">
                        <div className="flex items-center gap-2">
                            <img src={message[1]} alt="logo" className="w-10 h-10 object-contain mb-2 rounded-full"/>
                            <textarea type="text" id={`response-${index}`} className="focus:border-blue-500 focus:outline-none" rows={3} placeholder={translatedTexts[2]}/>
                        </div>

                        <div className="flex justify-end">
                            <div className="w-30">
                                <button type="submit">{translatedTexts[3]}</button>
                            </div>
                        </div>
                    </form>
                </div>
                ))}
                
            </div>
        </div>
    );
}