const express = require('express');

const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/userController');


router.post('/', controller.createProfile);
router.get('/me', controller.getMyProfile);
router.get('/:userId', controller.getProfile);
router.put('/:userId', controller.updateProfile);
router.post('/:userId/follow', controller.followUser);
router.post('/:userId/unfollow', controller.unfollowUser);
router.post("/upload-avatar", upload.single("avatar"), controller.updateImage); 
router.get("/:userId/following", controller.getFollowing);

module.exports = router;
