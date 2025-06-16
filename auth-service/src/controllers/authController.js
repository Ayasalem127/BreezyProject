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

    const token = generateToken({ id: user._id, username: user.displayName , role:"user"  });
    res.status(201).json({ message: "Compte créé. Un code vous a été envoyé par email.", token });

  } catch (err) {
    next(err);
  }
};
exports.login =async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, username: user.displayName,role:"user" }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.authenticate = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("TOKEN:", authHeader);
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      console.log("DECODED USER:", user);

      if (err || !user) return res.sendStatus(403);

    // Enrichir les headers pour Nginx
res.set('x-user-id', user.id);
res.set('x-user-username', user.username);
res.set('x-user-role', user.role);

    console.log("RES:", res.headers);
    return res.sendStatus(200);
    });
  } catch (error) {
    console.error("Erreur auth:", error);
    return res.sendStatus(500);
  }
};

