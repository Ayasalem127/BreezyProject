const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const auth = require("../middlewares/auth");


// router.post("/", auth, postController.createPost);
router.post("/", postController.createPost); 

router.put("/:id", postController.updatePost);     // Modifier un post
router.delete("/:id", postController.deletePost);  // Supprimer un post
router.get("/user/:userId", postController.getPostsByUser);   //récupérer les posts d'un utilisateur

router.get("/me", postController.getMyPosts);         //récupérer mes propres tweet

router.get("/feed", postController.getFeed);      //récup les tweet de mes abonnements

router.post("/:id/like", postController.toggleLikePost); //like/dislike un post
router.get("/:id/likes", postController.getLikes);



module.exports = router;



