const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
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

   
    // const code = Math.floor(100000 + Math.random() * 900000).toString();
    // await sendVerificationEmail(email, code);

    const token = generateToken({ id: user._id, username: user.username });
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
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
