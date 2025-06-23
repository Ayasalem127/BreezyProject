'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useToggleTargetComponent } from "@/context/ToggleTargetComponentContext";

export default function NotificationsPC() {
  const { visible } = useToggleTargetComponent();
  const [notifications, setNotifications] = useState([]);

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
        return "a liké votre post";
      case "like_comment":
        return "a liké votre commentaire";
      case "comment_post":
        return "a commenté votre post";
      case "comment_reply":
        return "a répondu à votre commentaire";
      case "mention":
        return "vous a mentionné";
      case "follow":
        return "a commencé à vous suivre";
      default:
        return notif.message || "vous a notifié";
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed top-12 right-4 w-80 bg-white shadow-lg p-4 rounded-xl z-50 max-h-[60vh] overflow-y-auto">
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucune notification</p>
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
