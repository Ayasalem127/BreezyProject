'use client';
import Link from "next/link";

export default function Subscriptions() {
    const subscriptions = [["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"]];

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 p-5">Mes abonnements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
                {subscriptions.map((subscription, index) => (
                    <Link href={"/otherProfile"} key={index}>
                        <div className="p-4 box-border flex flex-row items-center justify-center rounded-lg gap-4">
                            <img src={subscription[1]} alt="photo de profil" className="w-10 h-10 object-contain rounded-full"/>
                            <span className="font-semibold">{subscription[0]}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}