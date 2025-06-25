import Image from "next/image";
import WelcomeButtons from "@/components/WelcomeButtons";
import {AuthProvider} from "../context/AuthContext"
export default function Home() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 w-full h-screen-minus-navbar">
      <div className="flex items-center justify-center">
        <img src="/logo-removebg.png" alt="logo" className="w-50 h-50 sm:w-full sm:h-150 object-contain mb-2" />
      </div>
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div style={{ boxShadow: "0 12px 32px var(--shadow-color)", borderColor: 'var(--input-border)' }} className="flex flex-col items-center justify-center rounded-2xl border w-2/3 h-9/10">
          <h1>Bienvenue sur Kitties</h1>
          <main className="w-full px-6">
            <WelcomeButtons />
          </main>
        </div>
      </div>
    </div>
  
  );
}