const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const checkRole = require('../middlewares/checkRole');

router.post('/', controller.createProfile);
router.get('/me', controller.getMyProfile);
router.get('/:userId', controller.getProfile);
router.put('/:userId', controller.updateProfile);
router.post('/:userId/follow', controller.followUser);
router.post('/:userId/unfollow', controller.unfollowUser);

router.get("/:userId/following", controller.getFollowing);

router.post('/:userId/ban', checkRole(['admin', 'moderator']), controller.banUser);
router.post('/:userId/suspend', checkRole(['admin', 'moderator']), controller.suspendUser);
router.post('/:userId/reactivate', checkRole(['admin', 'moderator']), controller.reactivateUser);

module.exports = router;
