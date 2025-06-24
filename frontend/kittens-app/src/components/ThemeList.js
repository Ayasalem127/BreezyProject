'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function ThemeList({ onClose, onSelect }) {
    const ref = useRef();

    const [translatedTexts, setTranslatedTexts] = useState([]);

    const textsToTranslate = ["Clair", "Sombre", "Pastel", "Minuit", "Forêt", "Fleuri", "Chaleureux", "Fruité", "Océan", "Terre"];

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
        const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            onClose();
        }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleThemeChange = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        onSelect(theme);
        onClose();
    };

    return (
        <div ref={ref} style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--input-border)', boxShadow: "0 12px 32px var(--shadow-color)" }} className="absolute right-6 top-14 w-50 border rounded z-50">
            <ul>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('light')}>
                {translatedTexts[0]}
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('dark')}>
                {translatedTexts[1]}
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('pastel')}>
                {translatedTexts[2]}
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('midnight')}>
                {translatedTexts[3]}
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('forest')}>
                {translatedTexts[4]}
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('blossom')}>
                {translatedTexts[5]}
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('sunset')}>
                {translatedTexts[6]}
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('grape')}>
                {translatedTexts[7]}
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('ocean')}>
                {translatedTexts[8]}
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('earth')}>
                {translatedTexts[9]}
                </li>
            </ul>
        </div>
    );
}