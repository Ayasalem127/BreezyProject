"use client"
import OtherInformations from "@/components/OtherInformations";
import OtherMessages from "@/components/OtherMessages";
import { useSearchParams } from "next/navigation";
export default function Home() {
     const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  return (
    <div className="w-full px-2 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 p-10">Profil utilisateur</h1>
          {userId && <OtherInformations userId={userId} />}
          {userId && <OtherMessages userId={userId} />}
    </div>
  );
}