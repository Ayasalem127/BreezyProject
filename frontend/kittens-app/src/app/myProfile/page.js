import MyInformations from "@/components/MyInformations";
import MyMessages from "@/components/MyMessages";

export default function Home() {
  return (
    <div className="w-full px-2 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 p-10">Mon profil</h1>
        <MyInformations />
        <MyMessages />
    </div>
  );
}