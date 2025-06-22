'use client';
import Link from "next/link";

export default function Subscriptions() {
    const subscriptions = [["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"], ["username", "/logo.webp"]];

    return (
        <div>
            <h2>Mes abonnements</h2>
            <div className="flex flex-col items-center w-full px-4">
                {subscriptions.map((subscription, index) => (
                    <div key={index} style={{ boxShadow: "0 12px 32px var(--shadow-color)", borderColor: 'var(--input-border)' }} className="w-full sm:w-[calc(50%-0.5rem)] p-2 m-4 box-border flex flex-col justify-between border rounded-2xl">
                        <Link href={"/otherProfile"}>
                            <div className="p-2 box-border flex flex-row items-center justify-center rounded-lg gap-4">
                                <img src={subscription[1]} alt="photo de profil" className="w-10 h-10 object-contain rounded-full"/>
                                <span className="font-semibold">{subscription[0]}</span>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}