const UserProfile = require('../models/UserProfile');
const multer = require("multer")

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
// Config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // dossier où on stockes
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // nom unique
  }
});  
const upload = multer({ storage });
exports.updateImage =  async (req, res) => {
  try {
     if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }
console.log("req.file:", req.file);
        const userId = req.headers['x-user-id'];
    const imagePath = `/uploads/${req.file.filename}`;
console.log("userid",userId);
console.log("imagePath",imagePath);
    // Mise à jour de l'utilisateur
 console.log("✅ Fichier reçu :", req.file.path);
console.log("✅ Chemin image enregistré :", `/uploads/${req.file.filename}`);
console.log("✅ userId reçu :", req.headers['x-user-id']);


    const user = await UserProfile.findOneAndUpdate(
  { userId: userId },
  { avatarUrl: imagePath },
  { new: true }
);

if (!user) {
  return res.status(404).json({ error: "Utilisateur non trouvé avec cet userId" });
}

res.json({ success: true, avatar: user.avatar });

  } catch (err) {
    res.status(500).json({ error: "Erreur upload avatar" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updated = await UserProfile.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.followUser = async (req, res) => {
  const { userId } = req.params;
  const { followerId } = req.body;
  if (userId === followerId) return res.status(400).json({ message: "Impossible de se suivre soi-même" });

  try {
    const user = await UserProfile.findOne({ userId });
    const follower = await UserProfile.findOne({ userId: followerId });

    if (!user || !follower) return res.status(404).json({ message: "Utilisateurs non trouvés" });

    if (!user.followers.includes(follower.userId)) user.followers.push(follower.userId);
    if (!follower.following.includes(user.userId)) follower.following.push(user.userId);

    await user.save();
    await follower.save();

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
    const { userId } = req.params;

    const user = await UserProfile.findOne({ userId });

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    // On renvoie la liste des _id MongoDB des utilisateurs suivis
    res.json({ following: user.following });
  } catch (err) {
    console.error("Erreur getFollowing :", err.message);
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