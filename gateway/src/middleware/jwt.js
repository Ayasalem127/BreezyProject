require('dotenv').config();
const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(" JWT décodé dans la gateway:", decoded);

    // 🔒 Bloque tout utilisateur non "active"
    if (decoded.status !== 'active') {
      return res.status(403).json({ error: `Compte ${decoded.status} bloqué.` });
    }

    // ✅ Ajout des infos dans req et headers (si propagées)
    req.user = decoded;
    req.headers['x-user-id'] = decoded.id;
    req.headers['x-user-username'] = decoded.username;
    req.headers['x-user-role'] = decoded.role;

    next();
  } catch (error) {
    console.error("Erreur JWT:", error.message);
    return res.status(403).json({ error: 'Token invalide' });
  }
};

module.exports = validateJWT;
