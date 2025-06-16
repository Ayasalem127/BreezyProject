const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.post('/', controller.createProfile);
router.get('/me', controller.getMyProfile);
router.get('/:userId', controller.getProfile);
router.put('/:userId', controller.updateProfile);
router.post('/:userId/follow', controller.followUser);
router.post('/:userId/unfollow', controller.unfollowUser);

router.get("/:userId/following", controller.getFollowing);

module.exports = router;
