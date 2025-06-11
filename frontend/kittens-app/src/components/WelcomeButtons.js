import Link from "next/link";

export default function WelcomeButtons() {
    return (
        <div className="flex flex-col gap-y-4 p-10 items-center">
            <Link href={"/connection"}>
                <div style={{ backgroundColor: 'var(--buttons)' }} className="p-4 rounded-lg shadow-md text-center w-sm">
                    <p>Se connecter</p>
                </div>
            </Link>
            <Link href={"/userCreation"}>
                <div style={{ backgroundColor: 'var(--buttons)' }} className="p-4 rounded-lg shadow-md text-center w-sm">
                    <p>S'inscrire</p>
                </div>
            </Link>
        </div>
    );
}