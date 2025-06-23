'use client';

import Publish from "@/components/Publish";
import Messages from "@/components/Messages";
import UsersSuggestionPC from "@/components/UsersSuggestionPC";
import NotificationsPC from "@/components/NotificationsPC";
import { useToggleTargetComponent } from "@/context/ToggleTargetComponentContext";

export default function Home() {
  const { visible } = useToggleTargetComponent();

  return (
    <div className="w-full px-2 text-center">
        <h1>Accueil</h1>

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