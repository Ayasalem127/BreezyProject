const Notification = require("../models/notification.model");
// const UserProfile = require("../models/userprofile.model"); // si tu veux enrichir avec displayName

// 📩 Créer une notification
exports.createNotification = async (req, res) => {
  console.log("🔥 Notification reçue !");
  console.log("Body :", req.body);

  const { recipientId, senderId, type, message, postId } = req.body;

  try {
    const notification = new Notification({
      recipientId,
      senderId,
      type,
      message,
      postId,
      read: false
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    console.error("❌ Erreur création notification :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 📬 Récupérer MES notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"]; // injecté par la gateway

    const notifications = await Notification.find({ recipientId: userId }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error("Erreur récupération notifications :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) return res.status(404).json({ message: "Notification introuvable" });
    if (notification.recipientId !== userId) return res.status(403).json({ message: "Accès interdit" });

    notification.read = true;
    await notification.save();

    res.json({ message: "Notification marquée comme lue" });
  } catch (err) {
    console.error("Erreur marquage notification :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
