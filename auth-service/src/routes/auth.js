require('dotenv');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authController= require ('../controllers/authController')
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register',authController.register);

router.post('/login',authController.login );
router.get('/authenticate',authController.authenticate );

router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);


module.exports = router;
