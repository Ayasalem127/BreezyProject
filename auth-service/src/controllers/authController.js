require('dotenv').config();
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const axios = require("axios");
const jwt = require('jsonwebtoken');

// const { sendVerificationEmail } = require('../utils/mailer');
const { isValidEmail, isStrongPassword } = require('../utils/validator');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Email invalide" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: "Mot de passe trop faible (6 caractères min, 1 chiffre)" });
    }

    const exists = await User.findOne(  { email } );
    if (exists) {
      return res.status(400).json({ message: "Email ou nom d'utilisateur déjà utilisé" });
    }

    const user = new User({ username, email, password });
    await user.save();
    const response = await axios.post(`http://user-service:4001/api/users`, {
    userId: user._id,
    displayName: username,
    bio: "",
    avatarUrl: ""
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

   
    // const code = Math.floor(100000 + Math.random() * 900000).toString();
    // await sendVerificationEmail(email, code);

    const token = generateToken({ id: user._id, username: username , role:"user"  });

    res.cookie('token', token, {
  httpOnly: true,          //  pas accessible en JS
  secure: true,            //  seulement en HTTPS
  sameSite: 'lax',         // ou 'strict' ou 'none' selon ton besoin
  maxAge: 3600000          // 1h en ms
});
  res.status(201).json({ message: "création du compte réussie" });

  } catch (err) {
    next(err);
  }
};
exports.logout = async (req, res) => {
  try {
    // Supprimer le cookie HttpOnly côté serveur
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // true en production HTTPS
      sameSite: "lax"
    });

    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la déconnexion" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Recherche de l'utilisateur avec email:", email);
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      console.log("Échec des identifiants");
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    console.log("Utilisateur trouvé:", user._id);

    const profileRes = await axios.get(`http://user-service:4001/api/users/${user._id}`);
    const profile = profileRes.data;

    console.log("Profil utilisateur:", profile);

    if (profile.status === "suspended" && profile.suspendedUntil) {
      const now = new Date();
      const until = new Date(profile.suspendedUntil);
      if (now > until) {
        console.log("Réactivation automatique du compte suspendu");
        await axios.post(`http://user-service:4001/api/users/${user._id}/reactivate`);
        profile.status = "active";
      }
    }

    if (profile.status === "suspended") {
      console.log("Connexion bloquée: compte suspendu");
      return res.status(403).json({ error: "Votre compte est suspendu." });
    }
    if (profile.status === "banned") {
      console.log("Connexion bloquée: compte banni");
      return res.status(403).json({ error: "Votre compte est banni." });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        status: profile.status,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" }
    );

    user.refreshTokens.push(refreshToken);
    await user.save();

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      message: "Connexion réussie",
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: profile.status,
      },
    });

  } catch (err) {
    console.error("Erreur login:", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};




exports.authenticate = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1] || req.cookies?.token;

    if (!token) return res.status(401).end();

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err || !decoded) return res.sendStatus(403);

      // 🔍 Récupération role/status depuis user-service
      try {
        const profileRes = await axios.get(`http://user-service:4001/api/users/${decoded.id}`);
        const profile = profileRes.data;

        if (profile.status !== 'active') {
          return res.status(403).json({ error: `Compte ${profile.status} bloqué.` });
        }

        res.set('X-User-Id', decoded.id);
        res.set('X-User-Username', profile.displayName || decoded.username);
        res.set('X-User-Role', profile.role || 'user');

        return res.sendStatus(200);
      } catch (fetchError) {
        console.error("Erreur récupération profil:", fetchError.message);
        return res.sendStatus(500);
      }
    });

  } catch (error) {
    console.error("Erreur auth:", error);
    return res.sendStatus(500);
  }
};



exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: 'Aucun token fourni' });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);

    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(403).json({ message: 'Token invalide' });
    }

    // ✅ Appel à user-service pour récupérer role et status à jour
    const profileRes = await axios.get(`http://user-service:4001/api/users/${user._id}`);
    const profile = profileRes.data;

    const role = profile.role || 'user';
    const status = profile.status || 'active';
    const username = profile.displayName || user.username;

    const newAccessToken = jwt.sign(
      { id: user._id, username, role, status },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Erreur refreshToken:", err.message);
    res.status(403).json({ message: 'Token expiré ou invalide' });
  }
};


