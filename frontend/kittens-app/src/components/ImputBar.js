'use client';

import { useRef } from "react";

export default function InputBar() {
    const textareaRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const message = e.target.elements.message.value;

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
        <div className="fixed bottom-0 w-full flex justify-center bg-white border-t border-gray-300 z-50">
            <form onSubmit={handleSubmit} className="flex w-full max-w-3xl items-center gap-2 p-2">
                <div className="flex-grow">
                    <textarea
                        id="message"
                        ref={textareaRef}
                        onInput={autoResize}
                        className="w-full resize-none overflow-hidden max-h-[100px] rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Écris ton message..."
                        rows={1}
                    />
                </div>
                <div className="flex-shrink-0 p-2">
                    <button
                        type="submit"
                        className="text-sm px-4 py-2 rounded-full transition"
                    >
                        Envoyer
                    </button>
                </div>
            </form>
        </div>
    );
}