'use client';
import { useState } from "react";

export default function Searchbar() {
    const [searchText, setSearchText] = useState("");

    function handleChange(e) {
        setSearchText(e.target.value);
        console.log("Texte saisi :", e.target.value);
    }

    return (
        <div className="relative w-full">
            <img src="/loupe.png" alt="logo" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            <input type="text" id="searchbar" value={searchText} onChange={handleChange} className="bg-white mt-1 pl-10 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none" placeholder="Rechercher un utilisateur"/>
        </div>
    );
}