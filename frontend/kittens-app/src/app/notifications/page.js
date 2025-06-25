'use client';

import NotificationsMobile from "@/components/NotificationsMobile";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  const [translatedTitle, setTranslatedTitle] = useState("Mes notifications");

  const translate = async (texts) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const res = await axios.post('http://localhost:3001/language/language/translate', {texts}, { withCredentials: true });
      console.log(res.data);
      setTranslatedTitle(res.data.messages);

    } catch (error) {
      console.error("Erreur : ", error);
    }
  }

  useEffect(() => {
    translate("Mes notifications");
  }, []);

  return (
    <div className="w-full px-2 text-center">
      <h1>{translatedTitle}</h1>
      {/* Affiché uniquement sur mobile */}
      <div className="block sm:hidden">
        <NotificationsMobile />
      </div>
    </div>
  );
}