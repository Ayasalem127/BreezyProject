'use client';
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ChatSearchbar() {

    const [searchText, setSearchText] = useState("");
    const [users, setUsers] = useState([]);
    const [showResults, setShowResults] = useState(false);

    function handleChange(e) {
        const text = e.target.value;
        setSearchText(text);
        if (text.length > 0) {
            getUsers(text);
            setShowResults(true);
        } else {
            setUsers([]);
            setShowResults(false);
        }
    }

    const getUsers = async (query) => {
        if (!query || query.trim() === "") return;

        try {
            const res = await axios.post('http://localhost:3001/user/api/users/search', {query}, { withCredentials: true });
            console.log(res.data);
            setUsers(res.data);

        } catch (error) {
            console.error("Erreur : ", error);
        }
    }

    useEffect(() => {
        if (searchText && searchText.length > 0) {
            getUsers(searchText);
        } else {
            setUsers([]);
            setShowResults(false);
        }
    }, [searchText]);

    return (
        <div className="flex items-center justify-center">
            <div className="relative w-full sm:w-[calc(50%-0.5rem)] p-2 m-4 box-border flex flex-col justify-between space-y-2">
                <img src="/loupe.png" alt="loupe" className="absolute left-5 top-8 transform -translate-y-1/2 w-5 h-5" />
                <input
                type="text"
                id="searchbar"
                value={searchText}
                onChange={handleChange}
                className="bg-white mt-1 !pl-10 block w-full rounded-xl border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                placeholder="Rechercher un utilisateur"
                />

                {showResults && users.length > 0 && (
                    <ul className="absolute top-full mt-1 z-10 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {users.map((user) => (
                            <li key={user.userId} className="hover:bg-gray-100 p-2 cursor-pointer">
                                <Link href={`/chat/${user.userId}`}>
                                    <div className="flex items-center space-x-3">
                                        <span>{user.displayName}</span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

