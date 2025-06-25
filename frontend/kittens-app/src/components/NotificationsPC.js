'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useToggleTargetComponent } from "@/context/ToggleTargetComponentContext";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";


export default function NotificationsPC() {
  const { user } = useContext(AuthContext);
  const { visible } = useToggleTargetComponent();
  const [notifications, setNotifications] = useState([]);
  const [translatedTexts, setTranslatedTexts] = useState([]);
  const textsToTranslate = ["a liké votre post.", "a liké votre commentaire.", "a commenté votre post.", "a répondu à votre commentaire.", "vous a mentioné.", "a commencé à vous suivre.", "vous a notifié.", "Aucune notification."];

  const translateMany = async (texts) => {
      try {
            const res = await axios.post(
                'http://localhost:3001/language/language/translate',
                { texts },
                { withCredentials: true }
            );

            setTranslatedTexts(res.data.messages);
      } catch (error) {
          console.error("Erreur de traduction :", error);
      }
  };

  useEffect(() => {
      if(!user) return;
      translateMany(textsToTranslate);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:3001/notification/api/notifications", {
          withCredentials: true,
        });

        const rawNotifications = res.data;

        const enrichedNotifications = await Promise.all(
          rawNotifications.map(async (notif) => {
            try {
              const userRes = await axios.get(
                `http://localhost:3001/user/api/users/${notif.senderId}`,
                { withCredentials: true }
              );
              return {
                ...notif,
                senderDisplayName: userRes.data.displayName || notif.senderId,
              };
            } catch (err) {
              console.warn(`❗ Impossible de récupérer le displayName pour ${notif.senderId}`);
              return {
                ...notif,
                senderDisplayName: notif.senderId,
              };
            }
          })
        );

        setNotifications(enrichedNotifications);
      } catch (err) {
        console.error("❌ Erreur fetch notifications :", err);
      }
    };

    fetchNotifications();
  }, [visible]);

  const formatNotificationMessage = (notif) => {
    switch (notif.type) {
      case "like_post":
        return translatedTexts[0];
      case "like_comment":
        return translatedTexts[1];
      case "comment_post":
        return translatedTexts[2];
      case "comment_reply":
        return translatedTexts[3];
      case "mention":
        return translatedTexts[4];
      case "follow":
        return translatedTexts[5];
      default:
        return notif.message || translatedTexts[6];
    }
  };

  if (!visible) return null;

/*
    return (
        <div className="flex flex-col fixed top-12 left-0 items-end w-full overflow-y-auto" style={{ maxHeight: 'calc(100vh - var(--navbar-height))' }}>
            <div style={{ backgroundColor: 'var(--input-background)'}} className="w-1/4 p-2 rounded-xl">
                {notifications.map((notification, index) => (
                <div key={index} className="w-full p-2 mt-4 box-border border rounded-lg relative">
                    <span id={`deleteButton-${index}`} className="absolute top-2 right-2 text-l cursor-pointer" onClick={() => remove(index)} role="button" aria-label="delete button">❌</span>
                    <div className="flex items-center gap-3 w-full">
                        <img src={notification[1]} alt="photo de profil" className="w-10 h-10 object-contain rounded-full"/>
                        <span id={`notification-${index}`} rows={3} className="mt-1 block w-full rounded-md p-2 focus:border-blue-500 focus:outline-none">@{notification[0]} {notification[2]}</span>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}*/

  return (
    <div className="fixed top-12 right-4 w-80 bg-white shadow-lg p-4 rounded-xl z-50 max-h-[60vh] overflow-y-auto">
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">{translatedTexts[7]}</p>
      ) : (
        notifications.map((notif) => (
          <div key={notif._id} className="border p-2 rounded mb-2">
            🔔 <strong>{notif.senderDisplayName}</strong> {formatNotificationMessage(notif)}
          </div>
        ))
      )}
    </div>
  );
}

