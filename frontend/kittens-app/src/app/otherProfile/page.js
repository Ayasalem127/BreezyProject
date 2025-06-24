"use client"
import OtherInformations from "@/components/OtherInformations";
import OtherMessages from "@/components/OtherMessages";
import { useSearchParams } from "next/navigation";
import { useEffect} from "react";


export default function Home() {
     const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

   useEffect(() => {
    console.log("🔍 userId reçu dans la page Home:", userId);
  }, [userId]);

  return (
    <div className="w-full px-2 text-center">

        <h1 >Profil utilisateur</h1>
          {userId && <OtherInformations userId={userId} />}
          {userId && <OtherMessages userId={userId} />}

    </div>
  );
}