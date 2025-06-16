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
exports.login =async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)) ) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
     const token = jwt.sign({ id: user._id, username: user.username,role:user.role}, JWT_SECRET, { expiresIn: '1h' });
    
    res.cookie('token', token, {
  httpOnly: true,          //  pas accessible en JS
  secure: true,            //  seulement en HTTPS
  sameSite: 'lax',         // ou 'strict' ou 'none' selon ton besoin
  maxAge: 3600000          // 1h en ms
});
res.status(200).json({ message: "Connexion réussie" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.authenticate = async (req, res) => {
  try {
    const token = req.cookies?.token;
     console.log("token:", token);
if (!token) return res.status(401).end();

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      console.log("DECODED USER:", user);

      if (err || !user) return res.sendStatus(403);
      console.log("UserId", user.id);
      res.set('X-User-Id', user.id);
      res.set('X-User-Username', user.username || '');
      res.set('X-User-Role', user.role || 'user');

      return res.sendStatus(200); 
    });

  } catch (error) {
    console.error("Erreur auth:", error);
    return res.sendStatus(500);
  }
};

