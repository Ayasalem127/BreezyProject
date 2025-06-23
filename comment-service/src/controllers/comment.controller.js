const Comment = require("../models/comment.model");
const axios = require("axios"); // si ce n'est pas déjà en haut


exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content || content.length > 280) {
      return res.status(400).json({ message: "Contenu invalide" });
    }

    const comment = await Comment.create({
      postId,
      author: req.user.id,
      content,
      parentId: null
    });

    // 🔔 Notifier l'auteur du post
    const postRes = await axios.get(`http://gateway:3001/post/api/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${req.cookies.token}`,
        "x-user-id": req.user.id
      }
    });

    const post = postRes.data;
    const postAuthorId = post.author?._id || post.author;

    if (postAuthorId && postAuthorId !== req.user.id) {
      await axios.post("http://gateway:3001/notification/api/notifications", {
        recipientId: postAuthorId,
        senderId: req.user.id,
        type: "comment_post",
        message: "a commenté votre post",
        postId
      }, {
        headers: {
          Authorization: `Bearer ${req.cookies.token}`,
          "x-user-id": req.user.id
        }
      });
    }

    res.status(201).json(comment);
  } catch (err) {
    console.error("Erreur création commentaire :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



// répondre à un commentaire
exports.replyToComment = async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;

  if (!content || content.length > 280) {
    return res.status(400).json({ message: "Contenu invalide" });
  }

  try {
    const parent = await Comment.findById(commentId);
    if (!parent) return res.status(404).json({ message: "Commentaire parent introuvable" });

    const reply = await Comment.create({
      postId: parent.postId,
      author: req.user.id,
      content,
      parentId: commentId
    });

    // 🔔 Notifier l’auteur du commentaire parent
    if (String(parent.author) !== req.user.id) {
      await axios.post("http://gateway:3001/notification/api/notifications", {
        recipientId: parent.author,
        senderId: req.user.id,
        type: "comment_reply",
        message: "a répondu à votre commentaire",
        commentId: parent._id
      }, {
        headers: {
          Authorization: `Bearer ${req.cookies.token}`,
          "x-user-id": req.user.id
        }
      });
    }

    res.status(201).json(reply);
  } catch (err) {
    console.error("Erreur lors de la réponse :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



// récup les commentaires pour 1 post
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Récupère tous les commentaires du post
    const comments = await Comment.find({ postId }).sort({ createdAt: 1 }).lean();

    // Index pour construire l’arbre
    const commentMap = {};
    comments.forEach(c => {
      c.replies = [];
      commentMap[c._id] = c;
    });

    // Construction de l’arbre
    const tree = [];
    comments.forEach(c => {
      if (c.parentId) {
        const parent = commentMap[c.parentId];
        if (parent) parent.replies.push(c);
      } else {
        tree.push(c);
      }
    });

    res.json(tree);
  } catch (err) {
    console.error("Erreur récupération commentaires :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content || content.length > 280) {
    return res.status(400).json({ message: "Contenu invalide" });
  }

  try {
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Commentaire introuvable" });

    // Autorisation : auteur OU admin/modérateur
    const isAuthor = comment.author === req.user.id;
    const isPrivileged = ["admin", "moderator"].includes(req.user.role);
    if (!isAuthor && !isPrivileged) {
      return res.status(403).json({ message: "Non autorisé à modifier ce commentaire." });
    }

    comment.content = content;
    await comment.save();

    res.json({ message: "Commentaire modifié", comment });
  } catch (err) {
    console.error("Erreur updateComment :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


exports.deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Commentaire introuvable" });

    const isAuthor = comment.author === req.user.id;
    const isPrivileged = ["admin", "moderator"].includes(req.user.role);
    if (!isAuthor && !isPrivileged) {
      return res.status(403).json({ message: "Non autorisé à supprimer ce commentaire." });
    }

    await comment.deleteOne();
    res.json({ message: "Commentaire supprimé" });
  } catch (err) {
    console.error("Erreur deleteComment :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// fonction de like/dislike
exports.toggleLikeComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Commentaire introuvable" });

    const index = comment.likes.indexOf(userId);

    if (index === -1) {
      comment.likes.push(userId); // Like
    } else {
      comment.likes.splice(index, 1); // Unlike
    }

    await comment.save();
    res.json({ message: "Mise à jour du like", likes: comment.likes.length });
  } catch (err) {
    console.error("Erreur likeComment :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//renvoie le nombre de likes d'un commentaires
exports.getCommentLikes = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Commentaire introuvable" });

    const likesCount = comment.likes.length;

    // 🔐 Récupère l'ID de l'utilisateur depuis les headers envoyés par le gateway (ou middleware)
    const userId = req.headers['x-user-id'];
    const liked = userId && comment.likes.includes(userId);

    res.json({ likes: likesCount, liked }); // <-- retourne aussi le booléen liked
  } catch (err) {
    console.error("Erreur getCommentLikes :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//nombre de commentaires d'un post
exports.countCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const count = await Comment.countDocuments({ postId });     //compte le nombre total de commentaires liés au postId
    res.json({ postId, totalComments: count });
  } catch (err) {
    console.error("Erreur countCommentsByPost :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// nombre de réponses au commentaire
exports.countRepliesForComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const count = await Comment.countDocuments({ parentId: commentId });
    res.json({ commentId, replyCount: count });
  } catch (err) {
    console.error("Erreur countRepliesForComment :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
