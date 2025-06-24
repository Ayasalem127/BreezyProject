'use client';

import OtherInformations from "@/components/OtherInformations";
import OtherMessages from "@/components/OtherMessages";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [translatedTitle, setTranslatedTitle] = useState("Profil utilisateur");
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

   useEffect(() => {
    console.log("🔍 userId reçu dans la page Home:", userId);
  }, [userId]);

  const translate = async (text) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const res = await axios.post('http://localhost:3001/language/language/translate', {text}, { withCredentials: true });
      console.log(res.data);
      setTranslatedTitle(res.data.message);

    } catch (error) {
      console.error("Erreur : ", error);
    }
  }

  useEffect(() => {
    translate("Profil utilisateur");
  }, []);

  return (
    <div className="w-full px-2 text-center">
        <h1>{translatedTitle}</h1>
        {userId && <OtherInformations userId={userId} />}
        {userId && <OtherMessages userId={userId} />}

    </div>
  );
}