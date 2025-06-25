'use client';

import Searchbar from "@/components/Searchbar";
import Subscriptions from "@/components/Subscriptions";
import UsersSuggestionMobile from "@/components/UsersSuggestionMobile";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  const [translatedTitle, setTranslatedTitle] = useState("Utilisateurs");
  const [searchText, setSearchText] = useState("");

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
    translate("Utilisateurs");
  }, []);

  return (
    <div className="w-full px-2 text-center">
        <h1>{translatedTitle}</h1>
      
        <Searchbar searchText={searchText} setSearchText={setSearchText} />
      
        <Subscriptions searchText={searchText} />


        <div className="block sm:hidden mt-10">
          <UsersSuggestionMobile />
        </div>
    </div>
  );
}

