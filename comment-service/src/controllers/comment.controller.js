const Comment = require("../models/comment.model");

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

    res.json({ likes: comment.likes.length });
  } catch (err) {
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
