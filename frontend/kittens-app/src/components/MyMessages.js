'use client';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '@/context/AuthContext';

axios.defaults.withCredentials = true;

export default function MyMessages() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [likesByPost, setLikesByPost] = useState({});
  const [isVisible, setIsVisible] = useState([]);
  const [messageTexts, setMessageTexts] = useState([]);
  const [notification, setNotification] = useState("");
  const [commentsByPost, setCommentsByPost] = useState({});
  const [authors, setAuthors] = useState({});
  const { user } = useContext(AuthContext);
  const [translatedTexts, setTranslatedTexts] = useState([]);

    const textsToTranslate = ["Mes posts", "Modifier", "Publier", "Auteur", "Valider", "Annuler", "Répondre"];

    const translateMany = async (texts) => {
        try {
            const results = [];

            for (const text of texts) {
                const res = await axios.post(
                    'http://localhost:3001/language/language/translate',
                    { text },
                    { withCredentials: true }
                );

                results.push(res.data.message);
            }

            setTranslatedTexts(results);
        } catch (error) {
            console.error("Erreur de traduction :", error);
        }
    };

    useEffect(() => {
        translateMany(textsToTranslate);
    }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:3001/post/api/posts/me', { withCredentials: true });
        const postList = res.data;

        setPosts(postList);
        setIsVisible(postList.map(() => false));
        setMessageTexts(postList.map(p => p.content));

        const likesMap = {};
        const likedMap = {};
        const commentsMap = {};
        const authorIds = new Set();

        postList.forEach(post => authorIds.add(post.author));

        await Promise.all(postList.map(async (post) => {
          try {
            const likeRes = await axios.get(`http://localhost:3001/post/api/posts/${post._id}/likes`, { withCredentials: true });
            likesMap[post._id] = likeRes.data.likes || 0;
            likedMap[post._id] = likeRes.data.liked || false;
          } catch {
            likesMap[post._id] = 0;
            likedMap[post._id] = false;
          }

          try {
            const res = await axios.get(`http://localhost:3001/comment/api/comments/${post._id}`);
            commentsMap[post._id] = res.data;
            res.data.forEach(comment => {
              authorIds.add(comment.author);
              comment.replies?.forEach(reply => authorIds.add(reply.author));
            });
          } catch {
            commentsMap[post._id] = [];
          }
        }));

        const enrichedAuthors = { ...authors };
        await Promise.all(
          [...authorIds].map(async (id) => {
            if (!enrichedAuthors[id]) {
              try {
                const userRes = await axios.get(`http://localhost:3001/user/api/users/${id}`, { withCredentials: true });
                enrichedAuthors[id] = userRes.data.displayName || id;
              } catch {
                enrichedAuthors[id] = id;
              }
            }
          })
        );

        setAuthors(enrichedAuthors);
        setLikesByPost(likesMap);
        setLikedPosts(likedMap);
        setCommentsByPost(commentsMap);
      } catch (err) {
        console.error("Erreur chargement posts :", err);
      }
    };

    fetchPosts();
  }, []);

  const toggleResponse = (index) => {
    const updated = [...isVisible];
    updated[index] = !updated[index];
    setIsVisible(updated);
  };

  const toggleLike = async (index) => {
    const post = posts[index];
    try {
      const res = await axios.post(`http://localhost:3001/post/api/posts/${post._id}/like`);
      const { liked, totalLikes } = res.data;

      setLikedPosts(prev => ({ ...prev, [post._id]: liked }));
      setLikesByPost(prev => ({ ...prev, [post._id]: totalLikes }));
    } catch (err) {
      console.error("Erreur like post :", err);
    }
  };

  const handleModification = async (e, index) => {
    e.preventDefault();

    const updatedContent = messageTexts[index];
    const postId = posts[index]._id;

    try {
      await axios.put(`http://localhost:3001/post/api/posts/${postId}`, { content: updatedContent });
      setNotification("Message modifié avec succès ✔️");
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      console.error("Erreur modification post :", err);
      setNotification("❌ Échec de la modification");
    }
  };

  // const handleLikeComment = async (commentId, setLikes, setLiked) => {
  //   try {
  //     const res = await axios.post(`http://localhost:3001/comment/api/comments/${commentId}/like`, {}, { withCredentials: true });
  //     setLikes(res.data.likes);
  //     setLiked(res.data.liked);
  //   } catch (err) {
  //     console.log("Erreur like commentaire :", err);
  //   }
  // };


//   const toggleResponse = (index) => {
//     const updated = [...isVisible];
//     updated[index] = !updated[index];
//     setIsVisible(updated);
//   };

//   const toggleLike = async (index) => {
//   const post = posts[index];
//   try {
//     const res = await axios.post(`http://localhost:3001/post/api/posts/${post._id}/like`);
//     const { liked, totalLikes } = res.data;

//     const updatedLikes = [...likes];
//     updatedLikes[index] = liked;
//     setLikes(updatedLikes);

//     setLikesByPost(prev => ({ ...prev, [post._id]: totalLikes }));
//   } catch (err) {
//     console.error("Erreur like post :", err);
//   }
// };

// const handleModification = async (e, index) => {
//   e.preventDefault();

//   const updatedContent = messageTexts[index];
//   const postId = posts[index]._id;

//   try {
//     await axios.put(`https://localhost/post/api/posts/${postId}`, { content: updatedContent },  {withCredentials: true});
//     setNotification("Message modifié avec succès ✔️");
//     setTimeout(() => setNotification(""), 3000);
//   } catch (err) {
//     console.error("Erreur modification post :", err);
//     setNotification("❌ Échec de la modification");
//   }
// };


  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 p-5">{translatedTexts[0]}</h2>

      {notification && (
        <p className="text-center text-sm text-green-600 font-semibold">{notification}</p>
      )}

      <div className="flex flex-col items-center w-full px-4">
        {posts.map((message, index) => (
          <div key={index} className="w-full sm:w-[calc(50%-0.5rem)] p-4 m-4 box-border flex flex-col justify-between border border-gray-500 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3 w-full">
              <img src={message.avatarUrl} alt="avatar" className="w-10 h-10 object-contain mb-2 rounded-full" />
              <span className="font-semibold">{authors[message.author] || message.author}</span>
              <span className="flex ml-auto text-sm text-gray-500">
                {new Date(message.createdAt).toLocaleDateString()}
              </span>
            </div>

            <textarea
              value={messageTexts[index]}
              onChange={(e) => {
                const newTexts = [...messageTexts];
                newTexts[index] = e.target.value;
                setMessageTexts(newTexts);
              }}
              rows={3}
              className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2"
            />

            <div className="flex justify-start gap-6 mt-3">
              <div className="flex flex-col items-center">
                <span
                  className="text-3xl cursor-pointer"
                  onClick={() => toggleLike(index)}
                >
                  {likedPosts[message._id] ? "❤️" : "🤍"}
                </span>
                <span>{likesByPost[message._id] || 0}</span>
              </div>
              <div className="flex flex-col items-center">
                <span
                  className="text-3xl cursor-pointer"
                  onClick={() => toggleResponse(index)}
                >
                  💬
                </span>
                <span>{commentsByPost[message._id]?.length || 0}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={(e) => handleModification(e, index)}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {translatedTexts[1]}
              </button>
            </div>

            {isVisible[index] && (
              <div className="mt-4 space-y-4">
                <AddComment
                  postId={message._id}
                  onCommentAdded={(newComment) => {
                    setCommentsByPost(prev => ({
                      ...prev,
                      [message._id]: [...(prev[message._id] || []), newComment]
                    }));
                  }}
                />
                {commentsByPost[message._id]?.map(comment => (
                  <CommentThread
                    key={comment._id}
                    comment={comment}
                    authors={authors}
                    userId={user?._id}
                    onLike={handleLikeComment}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AddComment({ postId, onCommentAdded }) {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      const res = await axios.post(`http://localhost:3001/comment/api/comments/${postId}`, { content }, { withCredentials: true });
      onCommentAdded(res.data);
      setContent("");
    } catch (err) {
      console.log("Erreur ajout commentaire :", err.response?.data || err.message);
    }
  };

  return (
    <div className="mb-4">
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Ajouter un commentaire..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
      />
      <button onClick={handleSubmit} className="mt-1 px-3 py-1 bg-green-600 text-white rounded">
        {translatedTexts[2]}
      </button>
    </div>
  );
}

function CommentThread({ comment, authors, userId, onLike }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/comment/api/comments/${comment._id}/likes`, { withCredentials: true });
        setLikes(res.data.likes);
        setLiked(res.data.liked);
      } catch {}
    };
    fetchLikes();
  }, [comment._id]);

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    try {
      const res = await axios.post(`http://localhost:3001/comment/api/comments/reply/${comment._id}`, { content: replyContent }, { withCredentials: true });
      setReplies((prev) => [...prev, res.data]);
      setReplyContent("");
      setShowReplyBox(false);
    } catch (err) {
      console.log("Erreur envoi réponse :", err.response?.data || err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3001/comment/api/comments/${comment._id}`, { content: editContent }, { withCredentials: true });
      comment.content = editContent;
      setEditing(false);
    } catch (err) {
      console.log("Erreur modification :", err.response?.data || err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce commentaire ?")) return;
    try {
      await axios.delete(`http://localhost:3001/comment/api/comments/${comment._id}`, { withCredentials: true });
      window.location.reload();
    } catch (err) {
      console.log("Erreur suppression :", err.response?.data || err.message);
    }
  };
  
  const isOwner = String(comment.author?._id || comment.author) === String(userId);

  return (
    <div className="ml-4 border-l-2 border-gray-300 pl-4 mt-4 bg-blue-50 p-2 rounded">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{translatedTexts[3]} : {authors[comment.author] || comment.author}</span>
        <span>{new Date(comment.createdAt).toLocaleString()}</span>
      </div>

      {!editing ? (
        <p className="mt-1 whitespace-pre-wrap">{comment.content}</p>
      ) : (
        <div className="mt-2">
          <textarea
            className="w-full border p-2 rounded"
            rows={2}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="mt-1 flex gap-2">
            <button onClick={handleUpdate} className="px-3 py-1 bg-yellow-600 text-white rounded">{translatedTexts[4]}</button>
            <button onClick={() => setEditing(false)} className="px-3 py-1 bg-gray-500 text-white rounded">{translatedTexts[5]}</button>
          </div>
        </div>
      )}

      <div className="mt-2 flex items-center gap-3 text-sm">
        <span onClick={() => onLike(comment._id, setLikes, setLiked)} className={`cursor-pointer ${liked ? 'text-red-500' : ''}`}>
          {liked ? "❤️" : "🤍"} {likes}
        </span>
        <button onClick={() => setShowReplyBox(prev => !prev)} className="text-blue-600">{translatedTexts[6]}</button>
        {isOwner && (
          <>
            <button onClick={() => setEditing(true)} className="text-blue-600">✏️</button>
            <button onClick={handleDelete} className="text-red-600">❌</button>
          </>
        )}
      </div>

      {showReplyBox && (
        <div className="mt-2">
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            rows={2}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Votre réponse..."
          />
          <button className="mt-1 px-3 py-1 bg-blue-600 text-white rounded" onClick={handleReplySubmit}>Valider</button>
        </div>
      )}

      {replies.length > 0 && (
        <div className="mt-2">
          {replies.map((reply) => (
            <CommentThread key={reply._id} comment={reply} authors={authors} userId={userId} onLike={onLike} />
          ))}
        </div>
      )}
    </div>
  );
}
