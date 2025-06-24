'use client';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '@/context/AuthContext';

axios.defaults.withCredentials = true;

export default function MyMessages() {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isVisible, setIsVisible] = useState([]);
  const [messageTexts, setMessageTexts] = useState([]);
  const [notification, setNotification] = useState("");
  const [likesByPost, setLikesByPost] = useState({});
  const [commentsByPost, setCommentsByPost] = useState({});
  const [authors, setAuthors] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:3001/post/api/posts/me', { withCredentials: true });
        const postList = res.data;

        setPosts(postList);
        setLikes(postList.map(() => false));
        setIsVisible(postList.map(() => false));
        setMessageTexts(postList.map(p => p.content));

        const likesMap = {};
        const commentsMap = {};
        const authorIds = new Set();

        postList.forEach(post => authorIds.add(post.author));

        await Promise.all(postList.map(async (post) => {
          try {
            const likeRes = await axios.get(`http://localhost:3001/post/api/posts/${post._id}/likes`, { withCredentials: true });
            likesMap[post._id] = likeRes.data.likes || 0;
          } catch {
            likesMap[post._id] = 0;
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
        setCommentsByPost(commentsMap);
      } catch (err) {
        console.error("Erreur chargement posts :", err);
      }
    };

    fetchPosts();
  }, []);

  const handleLikeComment = async (commentId, setLikes, setLiked) => {
    try {
      const res = await axios.post(`http://localhost:3001/comment/api/comments/${commentId}/like`, {}, { withCredentials: true });
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch (err) {
      console.log("Erreur like commentaire :", err);
    }
  };

  const toggleResponse = (index) => {
    const updated = [...isVisible];
    updated[index] = !updated[index];
    setIsVisible(updated);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 p-5">Mes messages</h2>

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
                  {likes[index] ? "❤️" : "🤍"}
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
                Modifier
              </button>
            </div>

            {isVisible[index] && commentsByPost[message._id] && (
              <div className="mt-4 space-y-4">
                {commentsByPost[message._id].map(comment => (
                  <CommentThread key={comment._id} comment={comment} authors={authors} userId={user?._id} onLike={handleLikeComment} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentThread({ comment, authors, userId, onLike }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");

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

  return (
    <div className="ml-4 border-l-2 border-gray-300 pl-4 mt-4 bg-blue-50 p-2 rounded">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Auteur : {authors[comment.author] || comment.author}</span>
        <span>{new Date(comment.createdAt).toLocaleString()}</span>
      </div>
      <p className="mt-1 whitespace-pre-wrap">{comment.content}</p>
      <div className="mt-2 flex items-center gap-3 text-sm">
        <span onClick={() => onLike(comment._id, setLikes, setLiked)} className={`cursor-pointer ${liked ? 'text-red-500' : ''}`}>
          {liked ? "❤️" : "🤍"} {likes}
        </span>
        <button onClick={() => setShowReplyBox(prev => !prev)} className="text-blue-600">Répondre</button>
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
