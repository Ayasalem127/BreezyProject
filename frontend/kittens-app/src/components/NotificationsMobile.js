'use client';

import { useEffect, useState } from "react";
import axios from "axios";

export default function NotificationsMobile() {
  const [notifications, setNotifications] = useState([]);
  const [translatedTexts, setTranslatedTexts] = useState([]);

  const textsToTranslate = [
    "a liké votre post.",
    "a liké votre commentaire.",
    "a commenté votre post.",
    "a répondu à votre commentaire.",
    "vous a mentioné.",
    "a commencé à vous suivre.",
    "vous a notifié.",
    "Aucune notification."
  ];

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
    translateMany(textsToTranslate);
  }, []);

  useEffect(() => {
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
  }, []);

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

  return (
    <div className="min-h-screen p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Notifications</h1> */}

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">{translatedTexts[7]}</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif._id} className="border p-3 rounded-lg shadow-sm bg-gray-50">
              🔔 <strong>@{notif.senderDisplayName}</strong> {formatNotificationMessage(notif)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
