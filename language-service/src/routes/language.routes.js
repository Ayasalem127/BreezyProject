const express = require('express')
const languageController= require ('../controllers/language.controller')
const router = express.Router();

router.post('/new', languageController.createLanguage);
router.post('/update', languageController.updateLanguage);
router.get('/languages', languageController.getLanguages);
router.post('/translate', languageController.translate);

module.exports = router;
