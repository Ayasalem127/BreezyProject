import OtherInformations from "@/components/OtherInformations";
import OtherMessages from "@/components/OtherMessages";

export default function Home() {
  return (
    <div className="w-full px-2 text-center">
        <h1>Profil utilisateur</h1>
        <OtherInformations />
        <OtherMessages />
    </div>
  );
}