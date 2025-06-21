const express = require('express')
const messagingController= require ('../controllers/messaging.controller')
const router = express.Router();

router.post('/send', messagingController.createMessage);
router.get('/chats', messagingController.getChats);
router.get('/:otherId', messagingController.getMessages);
router.delete('/:messageId', messagingController.deleteMessage);
router.put('/:messageId', messagingController.updateMessage);

module.exports = router;
