import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{ backgroundColor: "var(--buttons)" }}
      className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 shadow-md z-50"
    >
      {/* Zone gauche : Logo + Accueil, Abonnements, Messages */}
      <div className="flex items-center space-x-6">
        {/* 👉 Ton image logo à gauche */}
        <img
          src="/logo.webp" // remplace par l’image que tu veux
          alt="Logo"
          className="w-10 h-10 object-contain"
        />

        <Link href="/home">
          <img
            src="/home.png"
            alt="Accueil"
            className="w-8 h-8 hover:scale-110 transition-transform"
          />
        </Link>

        <Link href="/subscriptions">
          <img
            src="/follow.png"
            alt="Abonnements"
            className="w-8 h-8 hover:scale-110 transition-transform"
          />
        </Link>

        <Link href="/">
          <img
            src="/messaging.png"
            alt="Messages"
            className="w-8 h-8 hover:scale-110 transition-transform"
          />
        </Link>
      </div>

      {/* Zone droite : Notifications, Profil */}
      <div className="flex items-center space-x-6">
        <Link href="/notifications">
          <img
            src="/notification.png"
            alt="Notifications"
            className="w-8 h-8 hover:scale-110 transition-transform"
          />
        </Link>

        <Link href="/myProfile">
          <img
            src="/logo.webp"
            alt="Profil"
            className="w-8 h-8 hover:scale-110 transition-transform"
          />
        </Link>
      </div>
    </nav>
  );
}