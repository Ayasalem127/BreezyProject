'use client';

import ProfilModification from "@/components/ProfileModification";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  const [translatedTitle, setTranslatedTitle] = useState("Modification de mon profil");

  const translate = async (text) => {
    try {
      const res = await axios.post('http://localhost:3001/language/language/translate', {text}, { withCredentials: true });
      console.log(res.data);
      setTranslatedTitle(res.data.message);

      await new Promise((resolve) => setTimeout(resolve, 200));

    } catch (error) {
      console.error("Erreur : ", error);
    }
  }

  useEffect(() => {
    translate("Modification de mon profil");
  }, []);

  return (
    <div className="w-full px-2 text-center">
        <h1>{translatedTitle}</h1>
        <ProfilModification />
    </div>
  );
}