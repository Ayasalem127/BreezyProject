'use client';
import { useState } from "react";

export default function Searchbar() {
    const [searchText, setSearchText] = useState("");

    function handleChange(e) {
        setSearchText(e.target.value);
        console.log("Texte saisi :", e.target.value);
    }

    return (
        <div className="flex items-center justify-center">
            <div className="relative w-full sm:w-[calc(50%-0.5rem)] p-2 m-4 box-border flex flex-col justify-between space-y-2">
                <img src="/loupe.png" alt="logo" className="absolute left-5 top-8 transform -translate-y-1/2 w-5 h-5" />
                <input type="text" id="searchbar" value={searchText} onChange={handleChange} className="!pl-10 focus:border-blue-500 focus:outline-none" placeholder="Rechercher un utilisateur"/>
            </div>
        </div>
    );
}