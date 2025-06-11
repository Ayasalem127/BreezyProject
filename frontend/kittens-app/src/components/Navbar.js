import Link from "next/link";

export default function Navbar() {
    return (
        <nav style={{ backgroundColor: 'var(--buttons)' }} className=" fixed bottom-0 left-0 w-full p-4 items-center">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/home">
                    <img src="/home.png" alt="Home" className="w-10 h-10 object-contain" />
                </Link>

                <Link href="/">
                    <img src="/messaging.png" alt="Messaging system" className="w-10 h-10 object-contain" />
                </Link>

                <Link href="/notifications">
                    <img src="/notification.png" alt="Notifications" className="w-10 h-10 object-contain" />
                </Link>

                <Link href="/myProfile">
                    <img src="/user.png" alt="User's profile" className="w-10 h-10 object-contain" />
                </Link>

                <Link href="/subscriptions">
                    <img src="/follow.png" alt="Subscribing" className="w-10 h-10 object-contain" />
                </Link>
            </div>
        </nav>
    );
}