import Publish from "@/components/Publish";
import Messages from "@/components/Messages";

export default function Home() {
  return (
    <div className="w-full px-2 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 p-10">Accueil</h1>
        <Publish />
        <Messages />
    </div>
  );
}