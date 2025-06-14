'use client';

import Publish from "@/components/Publish";
import Messages from "@/components/Messages";
import NotificationsPC from "@/components/NotificationsPC";
import { useToggleTargetComponent } from "@/context/ToggleTargetComponentContext";

export default function Home() {
  const { visible } = useToggleTargetComponent();

  return (
    <div className="w-full px-2 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 p-10">Accueil</h1>

        {visible && (
          <div className="w-full h-full z-50 flex items-center justify-center">
            <NotificationsPC />
          </div>
        )}

        <Publish />
        <Messages />
    </div>
  );
}