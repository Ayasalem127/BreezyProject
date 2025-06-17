import Image from "next/image";
import ConnectionForm from "@/components/ConnectionForm";

export default function Home() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 w-full h-screen-minus-navbar">
      <div className="flex items-center justify-center">
        <img src="/logo-removebg.png" alt="logo" className="w-full h-150 object-contain mb-2" />
      </div>
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="flex flex-col items-center justify-center rounded-2xl shadow-2xl border border-gray-500 w-2/3 h-9/10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 p-10">Connexion</h1>
          <main>
            <ConnectionForm />
          </main>
        </div>
      </div>
    </div>
  );
}