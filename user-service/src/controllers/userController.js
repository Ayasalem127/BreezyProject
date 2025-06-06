const UserProfile = require('../models/UserProfile');

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

    if (!user.followers.includes(follower._id)) user.followers.push(follower._id);
    if (!follower.following.includes(user._id)) follower.following.push(user._id);

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

    user.followers = user.followers.filter(id => id !== followerId);
    follower.following = follower.following.filter(id => id !== userId);

    await user.save();
    await follower.save();

    res.json({ message: "Unfollow réussi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
