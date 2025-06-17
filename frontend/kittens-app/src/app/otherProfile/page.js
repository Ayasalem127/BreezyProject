import OtherInformations from "@/components/OtherInformations";
import OtherMessages from "@/components/OtherMessages";

export default function Home() {
  return (
    <div className="w-full px-2 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 p-10">Profil utilisateur</h1>
        <OtherInformations />
        <OtherMessages />
    </div>
  );
}