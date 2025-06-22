import Link from "next/link";
import ThemeList from "./ThemeList";
import { useToggleTargetComponent } from "@/context/ToggleTargetComponentContext";
import { useState } from "react";

export default function Navbar() {
  const { setVisible } = useToggleTargetComponent();

  const [showThemeList, setShowThemeList] = useState(false);

  const photo = "/logo.webp";
  
  return (
    <nav
      style={{ backgroundColor: "var(--buttons)", boxShadow: "0 12px 32px var(--shadow-color)" }}
      className="fixed top-0 left-0 w-full h-12 flex items-center justify-between px-6 z-50"
    >
      {/* Zone gauche : Logo + Accueil, Abonnements, Messages */}
      <div className="flex items-center space-x-6 w-1/2">
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

        <div className="flex justify-center">
          <Link href="/subscriptions">
            <img
              src="/follow.png"
              alt="Abonnements"
              className="w-5 h-5 hover:scale-110 transition-transform"
            />
          </Link>
        </div>

        <div className="flex justify-end">
          <Link href="/chatList">
            <img
              src="/messaging.png"
              alt="Messages"
              className="w-5 h-5 hover:scale-110 transition-transform"
            />
          </Link>
        </div>
      </div>

      {/* Zone droite : Notifications, Theme, Profil */}
      <div className="flex items-center space-x-6 w-1/2 justify-end">
        <div role="button" className="hidden sm:block" onClick={() => setVisible(v => !v)}>
          <img
            src="/notification.png"
            alt="Notifications"
            className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer"
          />
        </div>

        <div role="button">
          <img
            src="/theme.png"
            alt="Theme"
            className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer"
            onClick={() => setShowThemeList((v) => !v)}
          />

          {showThemeList && (
            <ThemeList
              onClose={() => setShowThemeList(false)}
              onSelect={(theme) => console.log('Thème choisi :', theme)}
            />
          )}
        </div>

        <Link className="block sm:hidden" href="/notifications">
          <img
            src="/notification.png"
            alt="Notifications"
            className="w-5 h-5 hover:scale-110 transition-transform"
          />
        </Link>

        <Link href="/myProfile">
          <img
            src={photo}
            alt="Profil"
            className="w-5 h-5 hover:scale-110 transition-transform rounded-full"
          />
        </Link>
      </div>
    </nav>
  );
}