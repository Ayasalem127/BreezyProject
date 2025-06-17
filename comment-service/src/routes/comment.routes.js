const express = require("express");
const router = express.Router();
const controller = require("../controllers/comment.controller");
const auth = require("../middlewares/auth");
// const checkRole = require('./middlewares/checkRole');
router.post("/:postId", auth, controller.createComment);
router.post("/reply/:commentId", auth, controller.replyToComment);
router.get("/:postId", controller.getCommentsByPost);
router.put("/:id", auth, controller.updateComment);
router.delete("/:id", auth, controller.deleteComment);

router.post("/:id/like", auth, controller.toggleLikeComment);
router.get("/:id/likes", controller.getCommentLikes);


router.get("/:postId/count", controller.countCommentsByPost);
router.get("/reply-count/:commentId", controller.countRepliesForComment);



module.exports = router;
