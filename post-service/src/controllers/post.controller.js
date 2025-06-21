const Post = require("../models/post.model");
const axios = require("axios");
exports.createPost = async (req, res) => {
  try {
      const userId = req.headers['x-user-id'];
  const username = req.headers['x-user-username'];
  const role = req.headers['x-user-role'];

  console.log("USER ID:", userId);         // Doit afficher 684983...
  console.log("USERNAME:", username);      // Doit afficher le username
  console.log("ROLE:", role);              // Doit afficher "user"
    const { content } = req.body;
    const idUser=req.headers['x-user-id']
    console.log("headersss",req.headers)
     console.log("iduserrrrrrrrrr",req.headers['x-user-id'])
      if (!idUser) {
      return res.status(400).json({ message: 'Identifiant utilisateur (author) manquant dans les headers.' });
    }
    console.log(req.headers);
    if (!content || content.length > 280) {
      return res.status(400).json({ message: "Le contenu est requis (max 280 caractères)." });
    }

    const newPost = await Post.create({
      content,
      author: idUser
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Erreur lors de la création du post :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};




//modif possible d'un post seulement par son auteur ou un admin
exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    if (!content || content.length > 280) {
      return res.status(400).json({ message: "Contenu invalide." });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post non trouvé." });
     const idUser=req.headers['x-user-id']
        const roleUser=req.headers['x-user-role']
    // Vérifie si l'utilisateur est l'auteur ou un admin
    if (post.author !== idUser && roleUser !== "admin" && roleUser !== "moderator") {
      return res.status(403).json({ message: "Non autorisé à modifier ce post." });
    }

    post.content = content;
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};


//suppression d'un post possible seulement pour son euteur ou un admin
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post non trouvé." });

        const idUser=req.headers['x-user-id']
        const roleUser=req.headers['x-user-role']
    // Vérifie autorisation
    if (post.author !== idUser && roleUser!== "admin" && roleUser !== "moderator") {
      return res.status(403).json({ message: "Non autorisé à supprimer ce post." });
    }

    await post.deleteOne();
    res.json({ message: "Post supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

//voir les posts d'un utilisateur
exports.getPostsByUser = async (req, res) => {
  try {
          const idUser=req.headers['x-user-id']

    const posts = await Post.find({ author: idUser })
      .sort({ createdAt: -1 }); // Tri du plus récent au plus ancien

    //nmbre de likes du post
    posts.forEach(post => {
        post.likeCount = post.likes.length;
      });

    res.json(posts);
  } catch (err) {
    console.error("Erreur récupération posts utilisateur :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

//voir mes posts
exports.getMyPosts = async (req, res) => {
  try {
          const idUser=req.headers['x-user-id']
    const posts = await Post.find({ author: idUser })
      .sort({ createdAt: -1 });

    posts.forEach(post => {
      post.likeCount = post.likes.length;
    });

    res.json(posts);
  } catch (err) {
    console.error("Erreur getMyPosts :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

//voir mon feed avec les utilisateurs suivis
exports.getFeed = async (req, res) => {
  try {
    const idUser = req.headers['x-user-id'];
    console.log("idUser:", idUser);

    // 🔑 Récupération du token depuis le cookie
    const token = req.cookies?.token;
    const authHeader = token ? `Bearer ${token}` : undefined;

    console.log("Authorization header:", authHeader); // Debug

    const response = await axios.get(`http://gateway:3001/user/api/users/${idUser}/following`, {
      headers: {
        Authorization: authHeader,
        'x-user-id': idUser
      }
    });

    const following = response.data.following;
    console.log("Following:", following);

    if (!following || following.length === 0) {
      return res.json([]); // Aucun feed
    }

    const posts = await Post.find({ author: { $in: following } })
      .sort({ createdAt: -1 })
      .lean();

    posts.forEach(post => {
      post.likeCount = post.likes?.length ?? 0;
    });

    res.json(posts);
  } catch (err) {
    console.error("Erreur récupération feed :", err.message);
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};





// like/dislike post
exports.toggleLikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.headers['x-user-id']; // ✅ cohérent avec le nom utilisé ensuite

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post non trouvé." });

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      // Dislike → on enlève l'ID
      post.likes = post.likes.filter(id => id !== userId);
    } else {
      // Like → on ajoute l'ID
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      liked: !hasLiked,
      totalLikes: post.likes.length
    });
  } catch (err) {
    console.error("Erreur toggle like :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

