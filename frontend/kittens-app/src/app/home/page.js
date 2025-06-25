'use client';

import Publish from "@/components/Publish";
import Messages from "@/components/Messages";
import UsersSuggestionPC from "@/components/UsersSuggestionPC";
import NotificationsPC from "@/components/NotificationsPC";
import { useToggleTargetComponent } from "@/context/ToggleTargetComponentContext";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [translatedTitle, setTranslatedTitle] = useState("Accueil");
  const { visible } = useToggleTargetComponent();

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
    translate("Accueil");
  }, []);

  return (
    <div className="w-full px-2 text-center">
        <h1>{translatedTitle}</h1>

        {visible && (
          <div className="w-full h-full z-50 flex items-center justify-center">
            <NotificationsPC />
          </div>
        )}

        <Publish />

        <div className="hidden sm:block w-full h-full z-10 flex items-center justify-center">
          <UsersSuggestionPC />
        </div>

        <Messages />
    </div>
  );
}