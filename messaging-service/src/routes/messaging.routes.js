const express = require('express')
const messagingController= require ('../controllers/messaging.controller')
const router = express.Router();

router.post('/send', messagingController.createMessage);
router.get('/:recipientId', messagingController.getMessages);
router.delete('/:messageId', messagingController.deleteMessage);
router.put('/:messageId', messagingController.updateMessage);

module.exports = router;
