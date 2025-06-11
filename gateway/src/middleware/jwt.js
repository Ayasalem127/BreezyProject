const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {
  console.log('Middleware JWT appelé pour:', req.path);

  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Suppression du callback

    // Stocker les infos dans la requête si nécessaire
    req.user = decoded;

    // Enrichir les headers pour les microservices
    req.headers['x-user-id'] = decoded.userId;
    req.headers['x-user-email'] = decoded.email;
    req.headers['x-user-role'] = decoded.role;

    next(); // Passer au middleware suivant
  } catch (error) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};

module.exports = validateJWT;
