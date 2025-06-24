module.exports = (requiredRole) => {
  return (req, res, next) => {
    const roles = ['visitor', 'user', 'moderator', 'admin'];
    const userRole =   req.headers["x-user-role"] || 'visitor';
    console.log("userRole",userRole);
   if (!requiredRole.includes(userRole)) {
  return res.status(403).json({ message: "Accès interdit" });
}

    next();
  };
};
