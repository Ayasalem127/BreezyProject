'use client';
import { useState, useEffect } from "react";
import axios from "axios";

export default function MyMessages() {
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [isVisible, setIsVisible] = useState([]);
    const [messageTexts, setMessageTexts] = useState([]);

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

    const handleModification = async (e, index) => {
        e.preventDefault();
        const postId = posts[index]._id;
        const newContent = messageTexts[index];

        try {
            await axios.put(`http://localhost:3001/post/api/posts/${postId}`, { content: newContent }, { withCredentials: true });
            console.log(`Post modifié : ${newContent}`);
        } catch (err) {
            console.error("Erreur de modification :", err);
        }
    };

    const handleResponse = async (e, index) => {
        e.preventDefault();
        const response = e.target.elements[`response-${index}`].value;
        console.log(`Réponse au post ${posts[index]._id} : ${response}`);
        // Tu peux ensuite appeler une API de création de commentaire ici
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 p-5">Mes posts</h2>

            <div className="flex flex-wrap w-full gap-4">
                {posts.map((post, index) => (
                    <div key={post._id} className="w-full sm:w-[calc(50%-0.5rem)] p-2 mt-4 border rounded-lg">
                        <form onSubmit={(e) => handleModification(e, index)} className="space-y-2">
                            <div className="flex items-center gap-3">
                                <img src="/logo.webp" alt="avatar" className="w-10 h-10 object-contain rounded-full" />
                                <span className="font-semibold">{post.username || "Moi"}</span>
                                <span className="ml-auto text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>

                            <textarea
                                value={messageTexts[index]}
                                onChange={(e) => {
                                    const updatedTexts = [...messageTexts];
                                    updatedTexts[index] = e.target.value;
                                    setMessageTexts(updatedTexts);
                                }}
                                rows={3}
                                className="w-full border rounded-md p-2 focus:outline-none"
                            />

                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl cursor-pointer" onClick={() => toggleLike(index)}>{likes[index] ? "❤️" : "🤍"}</span>
                                    <span>{post.likes?.length || 0}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl cursor-pointer" onClick={() => toggleResponse(index)}>💬</span>
                                    <span>{post.comments?.length || 0}</span>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button type="submit" className="p-2 rounded-md bg-blue-500 text-white">Modifier</button>
                            </div>
                        </form>

                        {/* Formulaire de réponse */}
                        {isVisible[index] && (
                            <form onSubmit={(e) => handleResponse(e, index)} className="mt-2 space-y-2">
                                <textarea
                                    id={`response-${index}`}
                                    className="w-full border rounded-md p-2 focus:outline-none"
                                    rows={3}
                                    placeholder="Écrire une réponse..."
                                />
                                <div className="flex justify-end">
                                    <button type="submit" className="p-2 rounded-md bg-green-500 text-white">Publier</button>
                                </div>
                            </form>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
