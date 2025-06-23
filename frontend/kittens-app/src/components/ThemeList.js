'use client';

import { useEffect, useRef } from 'react';

export default function ThemeList({ onClose, onSelect }) {
    const ref = useRef();

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
        <div ref={ref} style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--input-border)', boxShadow: "0 12px 32px var(--shadow-color)" }} className="absolute right-6 top-14 w-32 border rounded z-50">
            <ul>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('light')}>
                Clair
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('dark')}>
                Sombre
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('pastel')}>
                Pastel
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('midnight')}>
                Minuit
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('forest')}>
                Forêt
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('blossom')}>
                Fleuri
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('sunset')}>
                Chaleureux
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('grape')}>
                Fruité
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('ocean')}>
                Océan
                </li>
                <li className="px-4 py-2 cursor-pointer" onClick={() => handleThemeChange('earth')}>
                Terre
                </li>
            </ul>
        </div>
    );
}