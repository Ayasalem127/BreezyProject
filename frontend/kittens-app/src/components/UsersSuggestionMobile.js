'use client';

import Link from "next/link";

export default function UsersSuggestionMobile() {
    const users = [["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"]];

    return (
        <div>
            <h2>Suggestions de suivi</h2>
            <div className="flex flex-col items-center w-full px-4">
                {users.map((user, index) => (
                <div key={index} style={{ boxShadow: "0 12px 32px var(--shadow-color)", borderColor: 'var(--input-border)' }} className="w-full p-2 m-4 box-border flex flex-col justify-between border rounded-2xl">
                        <Link href={"/otherProfile"}>
                            <div className="p-2 box-border flex flex-row items-center justify-center rounded-lg gap-4">
                                <img src={user[1]} alt="photo de profil" className="w-10 h-10 object-contain rounded-full"/>
                                <span className="font-semibold">{user[0]}</span>
                            </div>
                        </Link>
                </div>
                ))}
            </div>
        </div>
    );
}