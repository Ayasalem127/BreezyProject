import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{ backgroundColor: "var(--buttons)" }}
      className="fixed top-0 left-0 w-full h-12 flex items-center justify-between px-6 shadow-md z-50"
    >
      {/* Zone gauche : Logo + Accueil, Abonnements, Messages */}
      <div className="flex items-center space-x-6">
        <img
          src="/kitties transparents.webp" // remplace par l’image que tu veux
          alt="Logo"
          className="w-5 h-5 object-contain"
        />

        <Link href="/home">
          <img
            src="/home.png"
            alt="Accueil"
            className="w-5 h-5 hover:scale-110 transition-transform"
          />
        </Link>

        <Link href="/subscriptions">
          <img
            src="/follow.png"
            alt="Abonnements"
            className="w-5 h-5 hover:scale-110 transition-transform"
          />
        </Link>

        <Link href="/">
          <img
            src="/messaging.png"
            alt="Messages"
            className="w-5 h-5 hover:scale-110 transition-transform"
          />
        </Link>
      </div>

      {/* Zone droite : Notifications, Profil */}
      <div className="flex items-center space-x-6">
        <Link href="/notifications">
          <img
            src="/notification.png"
            alt="Notifications"
            className="w-5 h-5 hover:scale-110 transition-transform"
          />
        </Link>

        <Link href="/myProfile">
          <img
            src="/logo.webp"
            alt="Profil"
            className="w-5 h-5 hover:scale-110 transition-transform rounded-full"
          />
        </Link>
      </div>
    </nav>
  );
}