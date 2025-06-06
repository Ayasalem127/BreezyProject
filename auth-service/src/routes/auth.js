const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authController= require ('../controllers/authController')
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register',authController.register);

router.post('/login',authController.login );

router.post('/verify-token', (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, decoded });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
