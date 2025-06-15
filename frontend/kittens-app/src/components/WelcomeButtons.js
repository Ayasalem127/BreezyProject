import Link from "next/link";

export default function WelcomeButtons() {
    return (
        <div className="flex flex-col gap-y-4 p-10 items-center">
            <Link href={"/connection"}>
                <div style={{ backgroundColor: 'var(--buttons)' }} className="w-sm p-2 rounded-2xl shadow-2xl text-center font-semibold text-gray-800 border border-gray-400 hover:brightness-105 active:translate-y-[1px] transition-all duration-200">
                    <p>Se connecter</p>
                </div>
            </Link>
            <Link href={"/userCreation"}>
                <div style={{ backgroundColor: 'var(--buttons)' }} className="w-sm p-2 rounded-2xl shadow-2xl text-center font-semibold text-gray-800 border border-gray-400 hover:brightness-105 active:translate-y-[1px] transition-all duration-200">
                    <p>S'inscrire</p>
                </div>
            </Link>
        </div>
    );
}