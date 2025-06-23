'use client';
import Link from "next/link";
import { useToggleTargetComponent } from "@/context/ToggleTargetComponentContext";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { setVisible } = useToggleTargetComponent();
   const router = useRouter();
  const photo = "/logo.webp";
  const { setUser } = useContext(AuthContext); 
    const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3001/auth/auth/logout", {}, { withCredentials: true });
      setUser(null); // désauthentifier côté frontend
      router.push("/connection"); // rediriger vers la page de connexion
    } catch (err) {
      console.error("Erreur lors du logout :", err.message);
    }
  };
  return (
    <nav
      style={{ backgroundColor: "var(--buttons)" }}
      className="fixed top-0 left-0 w-full h-12 flex items-center justify-between px-6 shadow-md z-50"
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
          <Link href="/">
            <img
              src="/messaging.png"
              alt="Messages"
              className="w-5 h-5 hover:scale-110 transition-transform"
            />
          </Link>
        </div>
          
        <div className="flex justify-end cursor-pointer" onClick={handleLogout}>
      <img
        src="/logout.png"
        alt="logout"
        className="w-5 h-5 hover:scale-110 transition-transform"
      />
    </div>
    
      </div>

      {/* Zone droite : Notifications, Profil */}
      <div className="flex items-center space-x-6 w-1/2 justify-end">
        <div role="button" className="hidden sm:block" onClick={() => setVisible(v => !v)}>
          <img
            src="/notification.png"
            alt="Notifications"
            className="w-5 h-5 hover:scale-110 transition-transform"
          />
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