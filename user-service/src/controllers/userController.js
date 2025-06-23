const UserProfile = require('../models/UserProfile');
const axios = require("axios");

exports.createProfile = async (req, res) => {
  try {
    const { userId, displayName, bio, avatarUrl } = req.body;

    const exists = await UserProfile.findOne({ userId });
    if (exists) return res.status(400).json({ message: "Profil existe déjà" });

    const profile = new UserProfile({ userId, displayName, bio, avatarUrl });
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getMyProfile = async (req, res) => {
  try {
         const userId = req.headers['x-user-id'];
         console.log("idduserprofile",userId);
    const profile = await UserProfile
    .findOne({ userId: userId })
    .populate('followers', 'userId displayName avatarUrl') // on récupère les infos utiles seulement
    .populate('following', 'userId displayName avatarUrl');
    if (!profile) return res.status(404).json({ message: "Profil non trouvé" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const profile = await UserProfile
    .findOne({ userId: req.params.userId })
    .populate('followers', 'userId displayName avatarUrl') // on récupère les infos utiles seulement
    .populate('following', 'userId displayName avatarUrl');
    if (!profile) return res.status(404).json({ message: "Profil non trouvé" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }

    const userId = req.headers["x-user-id"];
    const imagePath = `/uploads/${req.file.filename}`;

    console.log("✅ Fichier reçu :", req.file.path);
    console.log("✅ Image enregistrée :", imagePath);
    console.log("✅ userId :", userId);

    const user = await UserProfile.findOneAndUpdate(
      { userId },
      { avatarUrl: imagePath },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: "Avatar mis à jour", avatarUrl: imagePath });
  } catch (err) {
    console.error("❌ Erreur :", err);
    res.status(500).json({ error: err.message });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    console.log("req body",req.body);
    console.log("req id" ,req.params.userId);
    const updated = await UserProfile.findOneAndUpdate(
      { _id: req.params.userId },
      req.body,
      { new: true }
    );
    console.log("update",updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.followUser = async (req, res) => {
  const userId = req.headers["x-user-id"];
  const { followerId } = req.body;
  if (userId === followerId) return res.status(400).json({ message: "Impossible de se suivre soi-même" });

  try {
    const user = await UserProfile.findOne({ userId: userId });
    const follower = await UserProfile.findOne({ userId: followerId });

    if (!user || !follower) return res.status(404).json({ message: "Utilisateurs non trouvés" });

    if (!user.following.includes(follower.userId)) user.following.push(follower.userId);
    if (!follower.followers.includes(user.userId)) follower.followers.push(user.userId);

    await user.save();
    await follower.save();

    // 🔔 Notifier l'utilisateur suivi
    const token = req.cookies?.token;
    if (token) {
      try {
        await axios.post("http://gateway:3001/notification/api/notifications", {
          recipientId: followerId,
          senderId: userId,
          type: "follow",
          message: "a commencé à vous suivre"
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId
          }
        });
      } catch (notifErr) {
        console.error("⚠️ Erreur envoi notification follow :", notifErr.response?.data || notifErr.message);
      }
    } else {
      console.warn("🔒 Aucun token trouvé pour envoyer la notification de follow.");
    }

    res.json({ message: "Follow réussi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unfollowUser = async (req, res) => {
  const { userId } = req.params;
  const { followerId } = req.body;

  try {
    const user = await UserProfile.findOne({ userId });
    const follower = await UserProfile.findOne({ userId: followerId });

    if (!user || !follower) return res.status(404).json({ message: "Utilisateurs non trouvés" });

    user.followers = user.followers.filter(id => id !== follower.userId);
    follower.following = follower.following.filter(id => id !== user.userId);

    await user.save();
    await follower.save();

    res.json({ message: "Unfollow réussi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getFollowing = async (req, res) => {
  try {
      const userId = req.headers['x-user-id'];
console.log("iduserx",userId);
    const user = await UserProfile.findOne( { userId: userId });
console.log("userfollowing",user)
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });
console.log("dddddddddddddddddddddd", user.following )
    // On renvoie la liste des _id MongoDB des utilisateurs suivis
     const followingProfiles = await UserProfile.find({
      userId: { $in: user.following }
    }).select('userId displayName avatarUrl');

    res.json(followingProfiles);
  } catch (err) {
    console.error("Erreur getFollowing :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
         const userId = req.headers['x-user-id'];
         console.log("id",userId);

    // Récupère le profil de l'utilisateur actuel pour obtenir sa liste de followings
    const currentUser = await UserProfile.findOne({userId: userId});
    console.log("lcurrentUser",userId);
    if (!currentUser) return res.status(404).json({ message: "Utilisateur non trouvé." });

    // On ajoute aussi son propre ID pour ne pas se suggérer lui-même
    const excludedIds = [...currentUser.following, userId];

    // Récupère jusqu'à 15 profils qu'il ne suit pas encore
    const suggestions = await UserProfile.find({ userId: { $nin: excludedIds } })
      .limit(15)
      .select('userId displayName avatarUrl');

    res.json(suggestions);
  } catch (err) {
    console.error("Erreur getSuggestions :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


// BAN
exports.banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updated = await UserProfile.findOneAndUpdate(
      { userId },
      { status: 'banned' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur banni", user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SUSPEND
exports.suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updated = await UserProfile.findOneAndUpdate(
      { userId },
      { status: 'suspended' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur suspendu", user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REACTIVATE
exports.reactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updated = await UserProfile.findOneAndUpdate(
      { userId },
      { status: 'active' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur réactivé", user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
