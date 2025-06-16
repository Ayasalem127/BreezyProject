import Image from "next/image";
import WelcomeButtons from "@/components/WelcomeButtons";
import {AuthProvider} from "../context/AuthContext"
export default function Home() {
  return (

    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 p-10">Bienvenue sur Kitties</h1>
      <img src="/logo.webp" alt="logo" className="w-full h-48 object-contain mb-2" />
      <main>
        <WelcomeButtons />
      </main>
    </div>
  
  );
}