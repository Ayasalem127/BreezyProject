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
    const userId = String(req.params.userId); // 🔐 on prend l'userId depuis l'URL et on le force en string
    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });

    // Ajoute un champ likeCount (optionnel si tu ne l'utilises pas)
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
    const token = req.cookies?.token;
    const authHeader = token ? `Bearer ${token}` : undefined;

    const response = await axios.get(`http://gateway:3001/user/api/users/${idUser}/following`, {
  headers: {
    Authorization: authHeader,
    'x-user-id': idUser
  }
});

// 👁️ Debug
console.log("👁️ Contenu brut de response.data :", response.data);

// ✅ Extraction des IDs suivis
const following = response.data.map(user => user.userId);
console.log("✅ Following récupérés :", following);

if (!Array.isArray(following) || following.length === 0) {
  return res.json([]);
}


    const posts = await Post.find({ author: { $in: following } }).sort({ createdAt: -1 }).lean();

    posts.forEach(post => {
      post.likeCount = post.likes?.length ?? 0;
    });

    res.json(posts);
  } catch (err) {
    console.error("Erreur récupération feed :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};






// like/dislike post
exports.toggleLikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.headers['x-user-id'];
    console.log("idUser:", userId);

    // 🔑 Récupération du token depuis les cookies
    const token = req.cookies?.token;
    const authHeader = token ? `Bearer ${token}` : null;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post non trouvé." });

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes = post.likes.filter(id => id !== userId);
    } else {
      post.likes.push(userId);

      // Envoi notification si like d'un autre utilisateur
      if (userId !== post.author.toString()) {
        try {
          const notifHeaders = {
            'x-user-id': userId
          };
          if (authHeader) notifHeaders.Authorization = authHeader;

          console.log("📡 Envoi notification à", post.author.toString(), "avec headers", notifHeaders);

          await axios.post(
            "http://gateway:3001/notification/api/notifications",
            {
              recipientId: post.author.toString(),
              senderId: userId,
              type: "like_post",
              message: "a liké votre post",
              postId
            },
            {
              headers: notifHeaders
            }
          );
        } catch (notifErr) {
          console.error("⚠️ Erreur lors de l'envoi de la notification :", notifErr.response?.data || notifErr.message);
        }
      }
    }

    await post.save();

    res.json({
      liked: !hasLiked,
      totalLikes: post.likes.length
    });

  } catch (err) {
    console.error("Erreur toggle like post :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};






exports.getLikes = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.headers['x-user-id']; // injecté par la gateway

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post introuvable" });

    const liked = post.likes.includes(userId);
    const totalLikes = post.likes.length;

    res.json({ likes: totalLikes, liked });
  } catch (err) {
    console.error("Erreur getLikes :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post non trouvé." });

    post.likeCount = post.likes.length;
    res.json(post);
  } catch (err) {
    console.error("Erreur getPostById :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
