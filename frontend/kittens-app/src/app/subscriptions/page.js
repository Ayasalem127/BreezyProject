'use client';

import Searchbar from "@/components/Searchbar";
import Subscriptions from "@/components/Subscriptions";
import UsersSuggestionMobile from "@/components/UsersSuggestionMobile";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  const [translatedTitle, setTranslatedTitle] = useState("Utilisateurs");

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
    translate("Utilisateurs");
  }, []);

  return (
    <div className="w-full px-2 text-center">
        <h1>{translatedTitle}</h1>
        <Searchbar />
        <Subscriptions />

        <div className="block sm:hidden mt-10">
          <UsersSuggestionMobile />
        </div>
    </div>
  );
}