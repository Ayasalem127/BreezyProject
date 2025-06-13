import Image from "next/image";
import UserCreationForm from "@/components/UserCreationForm";

export default function Home() {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 p-10">Création de compte</h1>
      <img src="/kitties transparents.webp" alt="logo" className="w-full h-48 object-contain mb-2" />
      <UserCreationForm />
    </div>
  );
}