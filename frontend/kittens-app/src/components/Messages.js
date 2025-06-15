'use client';
import { useState } from "react";

const messages = [["username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 3, [0, 1, 2, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]], ["username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 1, [3]]];
    const comments = [
        [0, "username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 0, []],
        [1, "username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 0, []],
        [2, "username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 0, []],
        [3, "username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 1, [4]],
        [4, "username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 1, [5]],
        [5, "username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 0, []],
        [6, "username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 0, []],
        [7, "username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 0, []],
        [8, "username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 0, []],
        [9, "username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 0, []],
        [10, "username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 0, []],
        [11, "username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 0, []],
        [12, "username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 0, []],
        [13, "username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 0, []],
        [14, "username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 0, []],
        [15, "username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 0, []],
    ];

function Comment({ commentId }) {
    const commentsById = Object.fromEntries(comments.map(c => [c[0], c]));
    const comment = commentsById[commentId];
    const [liked, setLiked] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    if (!comment) return null;

    const toggleLike = () => setLiked(prev => !prev);
    const toggleResponse = () => setIsVisible(prev => !prev);

    const handleResponse = (e) => {
        e.preventDefault();
        const response = e.target.elements[`response-${commentId}`].value;
        console.log(`Réponse au commentaire ${commentId} : ${response}`);
    };

    return (
        <div className="ml-6 mt-4 border-l-2 border-gray-300 pl-4">
        <div className="flex items-center gap-3">
            <img src={comment[2]} alt="avatar" className="w-8 h-8 rounded-full" />
            <span className="font-semibold">{comment[1]}</span>
            <span className="text-xs text-gray-500 ml-auto">{comment[3]}</span>
        </div>

        <textarea readOnly value={comment[4]} rows={2} className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2" />

        <div className="flex gap-3 mt-2 text-xl">
            <div className="flex flex-col items-center cursor-pointer" onClick={toggleLike}>
            <span>{liked ? "❤️" : "🤍"}</span>
            <span className="text-sm">{comment[5]}</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer" onClick={toggleResponse}>
            <span>💬</span>
            <span className="text-sm">{comment[6]}</span>
            </div>
        </div>

        {isVisible && (
            <form onSubmit={handleResponse} className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
                <img src={comment[2]} alt="avatar" className="w-8 h-8 rounded-full" />
                <textarea id={`response-${commentId}`} className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none" rows={3} placeholder="Laisse parler ton coeur..."/>
            </div>
            <div className="flex justify-end">
                <div className="w-30">
                    <button type="submit">Publier</button>
                </div>
            </div>
            </form>
        )}

        {comment[7].map(childId => (
            <Comment key={childId} commentId={childId} />
        ))}
        </div>
    );
}

export default function Messages() {
    const [likes, setLikes] = useState(Array(messages.length).fill(false));
    const [isVisible, setIsVisible] = useState(Array(messages.length).fill(false));
    const [visibleCommentsCount, setVisibleCommentsCount] = useState(
        messages.map(() => 10)
    );

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

    function showMoreComments(messageIndex) {
        setVisibleCommentsCount(prev => {
            const newCount = [...prev];
            newCount[messageIndex] += 10;
            return newCount;
        });
    }

    const handleResponse = async (e, index) => {
        e.preventDefault();

        const response = e.target.elements[`response-${index}`].value;

        //Affichage temporaire
        console.log(`Réponse : ${response}`);
    }

    return (
        <div className="flex flex-col items-center w-full px-4">
            {messages.map((message, index) => (
            <div key={index} className="w-full sm:w-[calc(50%-0.5rem)] p-4 m-4 box-border flex flex-col justify-center border border-gray-500 rounded-2xl shadow-2xl">
                <div className="flex items-center gap-3 w-full">
                    <img src={message[1]} alt="logo" className="w-10 h-10 object-contain mb-2 rounded-full"/>
                    <span className="font-semibold">{message[0]}</span>
                    <span className="flex ml-auto text-sm text-gray-500">{message[2]}</span>
                </div>

                <textarea readOnly id="message" value={message[3]} rows={3} className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"/>
                
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

                <div className="mt-4">
                    {message[6]
                    .slice(0, visibleCommentsCount[index])
                    .map((commentId) => (
                        <Comment key={commentId} commentId={commentId} />
                    ))}

                    {visibleCommentsCount[index] < message[6].length && (
                    <span
                        role="button"
                        onClick={() => showMoreComments(index)}
                        className="mt-2 text-sm text-blue-600 cursor-pointer"
                    >
                        Afficher plus
                    </span>
                    )}
                </div>

                <form onSubmit={(e) => handleResponse(e, index)} style={{display: isVisible[index] ? 'block' : 'none'}} className="rounded-lg w-full space-y-2">
                    <div className="flex items-center gap-2">
                    <img src={message[1]} alt="logo" className="w-10 h-10 object-contain mb-2 rounded-full"/>
                    <textarea type="text" id={`response-${index}`} className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none" rows={3} placeholder="Laisse parler ton coeur..."/>
                    </div>

                    <div className="flex justify-end">
                    <div className="w-30">
                    <button type="submit">Publier</button>
                    </div>
                    </div>
                </form>
            </div>
            ))}
            
        </div>
    );
}