
'use client';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '@/context/AuthContext';

axios.defaults.withCredentials = true;

export default function Messages() {
  const [posts, setPosts] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [likesByPost, setLikesByPost] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [isVisible, setIsVisible] = useState([]);
  const [authors, setAuthors] = useState({});

    const [translatedTexts, setTranslatedTexts] = useState([]);

    const textsToTranslate = ["Publier", "Auteur", "Valider", "Annuler", "Répondre"];

    const translateMany = async (texts) => {
        try {
            const res = await axios.post(
                'http://localhost:3001/language/language/translate',
                { texts },
                { withCredentials: true }
            );

            setTranslatedTexts(res.data.messages);
        } catch (error) {
            console.error("Erreur de traduction :", error);
        }
    };

    useEffect(() => {
        translateMany(textsToTranslate);
    }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await axios.get('http://localhost:3001/post/api/posts/feed');
        const postsData = postRes.data;
        
        const likeCounts = {};
        const commentsMap = {};
        const likedState = {};
        const authorIds = new Set();

        for (const post of postsData) {
          authorIds.add(post.author);

          try {
            const likeRes = await axios.get(`http://localhost:3001/post/api/posts/${post._id}/likes`, { withCredentials: true });
            likeCounts[post._id] = likeRes.data.likes || 0;
            likedState[post._id] = likeRes.data.liked || false;
          } catch {
            likeCounts[post._id] = 0;
            likedState[post._id] = false;
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
        }

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
        setPosts(postsData);
        setIsVisible(postsData.map(() => false));
        setLikesByPost(likeCounts);
        setCommentsByPost(commentsMap);
        setLikedPosts(likedState);
      } catch (err) {
        console.log("Erreur récupération des posts :", err);
      }
    };

    fetchData();
  }, []);

  const handlePostLike = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:3001/post/api/posts/${postId}/like`);
      const { liked, totalLikes } = res.data;
      setLikesByPost(prev => ({ ...prev, [postId]: totalLikes }));
      setLikedPosts(prev => ({ ...prev, [postId]: liked }));
    } catch (err) {
      console.log("Erreur like post :", err);
    }
  };

  const toggleResponse = (index) => {
    const updated = [...isVisible];
    updated[index] = !updated[index];
    setIsVisible(updated);
  };

  return (
    <div className="flex flex-col items-center w-full px-4">
      {posts.map((post, index) => (
        <div key={post._id} className="w-full sm:w-[calc(50%-0.5rem)] p-4 m-4 border border-gray-500 rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{translatedTexts[1]} : {authors[post.author] || post.author}</span>
            <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</span>
          </div>

          <textarea
            readOnly
            value={post.content}
            rows={3}
          />

          <div className="flex gap-4 mt-3 text-xl">
            <div className="flex flex-col items-center cursor-pointer" onClick={() => handlePostLike(post._id)}>
              <span>{likedPosts[post._id] ? "❤️" : "🤍"}</span>
              <span className="text-sm">{likesByPost[post._id] || 0}</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer" onClick={() => toggleResponse(index)}>
              <span>💬</span>
              <span className="text-sm">{commentsByPost[post._id]?.length || 0}</span>
            </div>
          </div>

          {isVisible[index] && (
            <div className="mt-4 space-y-4">
              <AddComment
                postId={post._id}
                onCommentAdded={(newComment) => {
                  setCommentsByPost(prev => ({
                    ...prev,
                    [post._id]: [...(prev[post._id] || []), newComment]
                  }));
                }}
              />
              {commentsByPost[post._id]?.map(comment => (
                <CommentThread key={comment._id} comment={comment} authors={authors} />
              ))}
            </div>
          )}
        </div>
      ))}
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
        placeholder="Ajouter un commentaire..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
      />
      <button onClick={handleSubmit}>
        {translatedTexts[0]}
      </button>
    </div>
  );
}

function CommentThread({ comment, authors }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replies, setReplies] = useState(comment.replies || []);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const { user } = useContext(AuthContext);
  const userId = user?.userId || user?._id;

  useEffect(() => {
    setReplies(comment.replies || []);
    const fetchLikes = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/comment/api/comments/${comment._id}/likes`, { withCredentials: true });
        setLikes(res.data.likes || 0);
        setLiked(res.data.liked || false);
      } catch (err) {
        console.log("Erreur récupération des likes commentaire :", err);
      }
    };
    fetchLikes();
  }, [comment._id, comment.replies?.length]);

  const handleLikeComment = async () => {
    try {
      const res = await axios.post(`http://localhost:3001/comment/api/comments/${comment._id}/like`, {}, { withCredentials: true });
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch (err) {
      console.log("Erreur like commentaire :", err);
    }
  };

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
    <div className="ml-4 border-l-2 border-gray-300 pl-4 mt-4 relative bg-blue-50 p-2 rounded">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{translatedTexts[1]} : {authors[comment.author] || comment.author}</span>
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
            <button onClick={handleUpdate} className="px-3 py-1 bg-yellow-600 text-white rounded">{translatedTexts[2]}</button>
            <button onClick={() => setEditing(false)} className="px-3 py-1 bg-gray-500 text-white rounded">{translatedTexts[3]}</button>
          </div>
        </div>
      )}

      <div className="mt-2 flex items-center gap-3 text-sm">
        <span onClick={handleLikeComment} className={`cursor-pointer ${liked ? "text-red-500" : ""}`}>
          {liked ? "❤️" : "🤍"} {likes}
        </span>
        <button className="text-blue-600" onClick={() => setShowReplyBox(prev => !prev)}>
          {translatedTexts[4]}
        </button>
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
          <button className="mt-1 px-3 py-1 bg-blue-600 text-white rounded" onClick={handleReplySubmit}>
            {translatedTexts[2]}
          </button>
        </div>
      )}

      {replies?.length > 0 && (
        <div className="mt-2">
          {replies.map((reply) => (
            <CommentThread key={reply._id} comment={reply} authors={authors} />
          ))}

        </div>
      )}
    </div>
  );
}