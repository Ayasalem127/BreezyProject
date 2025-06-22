'use client';

import { useRef } from "react";
import axios from "axios";

export default function InputBar({ userId }) {
    const textareaRef = useRef(null);

    const handleSubmit = async (e) => {
        //e.preventDefault();

        const message = e.target.elements.message.value;
        
        const res = await axios.post('http://localhost:3001/messaging/messaging/send', { content: message, recipientId: userId }, { withCredentials: true });

        //Affichage temporaire
        console.log(`Message : ${message}`);

        e.target.reset();

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    }

    const autoResize = (e) => {
        const textarea = e.target;
        const maxHeight = 100;

        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }

    return (
        <div style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--input-border)' }} className="fixed bottom-0 w-full flex justify-center border-t z-50">
            <form onSubmit={handleSubmit} className="flex w-full max-w-3xl items-center gap-2 p-2">
                <div className="flex-grow">
                    <textarea
                        id="message"
                        ref={textareaRef}
                        onInput={autoResize}
                        className="resize-none overflow-hidden max-h-[100px] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Écris ton message..."
                        rows={1}
                    />
                </div>
                <div className="flex-shrink-0 p-2">
                    <button type="submit">
                        Envoyer
                    </button>
                </div>
            </form>
        </div>
    );
}