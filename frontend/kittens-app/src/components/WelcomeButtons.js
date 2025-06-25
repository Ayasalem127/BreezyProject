import Link from "next/link";

export default function WelcomeButtons() {
    return (
        <div className="flex flex-col gap-y-4 p-10 items-center w-full">
            {/* Premier bouton */}
            <div className="w-full max-w-xs sm:w-xl">
                <Link href="/connection" className="block w-full">
                    <div
                        style={{
                            backgroundColor: 'var(--buttons)',
                            boxShadow: "0 4px 8px var(--shadow-color)",
                            borderColor: 'var(--input-border)',
                        }}
                        className="w-full p-3 rounded-2xl text-center font-semibold border hover:brightness-105 active:translate-y-[1px] transition-all duration-200"
                    >
                        Se connecter
                    </div>
                </Link>
            </div>

            <div className="w-full max-w-xs sm:w-xl">
                <Link href="/userCreation" className="block w-full">
                    <div
                        style={{
                            backgroundColor: 'var(--buttons)',
                            boxShadow: "0 4px 8px var(--shadow-color)",
                            borderColor: 'var(--input-border)',
                        }}
                        className="w-full p-3 rounded-2xl text-center font-semibold border hover:brightness-105 active:translate-y-[1px] transition-all duration-200"
                    >
                        S'inscrire
                    </div>
                </Link>
            </div>
        </div>
    );
}
