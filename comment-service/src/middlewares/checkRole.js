// middlewares/checkRole.js
module.exports = (requiredRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    next();
  };
};
