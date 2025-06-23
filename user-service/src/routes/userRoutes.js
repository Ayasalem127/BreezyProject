const express = require('express');

const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/userController');
const checkRole = require('../middlewares/checkRole');


router.post('/', controller.createProfile);
router.get('/me', controller.getMyProfile);
router.get('/suggestions', controller.getSuggestions);
router.post('/follow', controller.followUser);
router.get('/:userId', controller.getProfile);

router.put('/:userId', controller.updateProfile);

router.post('/:userId/unfollow', controller.unfollowUser);
router.post("/upload-avatar", upload.single("avatar"), controller.updateImage); 
router.get("/:userId/following", controller.getFollowing);

router.post('/:userId/ban', checkRole(['admin', 'moderator']), controller.banUser);
router.post('/:userId/suspend', checkRole(['admin', 'moderator']), controller.suspendUser);
router.post('/:userId/reactivate', checkRole(['admin', 'moderator']), controller.reactivateUser);



module.exports = router;
