'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function LanguagesList({ onClose, onSelect }) {
    const ref = useRef();
    const [languages, setLanguages] = useState([]);

    const getLanguages = async (e) => {
        try {
            const res = await axios.get('http://localhost:3001/language/language/languages', { withCredentials: true });
            console.log(res.data);
            setLanguages(res.data);

        } catch (error) {
            console.error("Erreur : ", error);
        }
    }

    useEffect(() => {
        getLanguages();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            onClose();
        }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleLangChange = async (code) => {
        try {
            const res = await axios.post('http://localhost:3001/language/language/update', {targetLanguage: code}, { withCredentials: true });
            console.log(res.data);
            onSelect(code);
            onClose();

            window.location.reload();

        } catch (error) {
            console.error("Erreur : ", error);
        }
    };

    return (
        <div ref={ref} style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--input-border)', boxShadow: "0 12px 32px var(--shadow-color)", maxHeight: 'calc(100vh - var(--navbar-height))', overflowY: 'auto' }} className="absolute right-6 top-14 w-50 border rounded z-50">
            <ul>
                {languages.map((language, index) => (
                    <li
                    key={index}
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => handleLangChange(language.code)}
                    >
                    {language.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}