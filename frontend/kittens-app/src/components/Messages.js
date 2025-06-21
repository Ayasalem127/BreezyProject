'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

export default function Messages() {
  const [posts, setPosts] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [likesByPost, setLikesByPost] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [isVisible, setIsVisible] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await axios.get('http://localhost:3001/post/api/posts/feed');
        const postsData = postRes.data;
        setPosts(postsData);
        setIsVisible(postsData.map(() => false));

        const likeCounts = {};
        const commentsMap = {};
        const likedState = {};

        for (const post of postsData) {
          // Likes
          try {
            const likeRes = await axios.get(`http://localhost:3001/post/api/posts/${post._id}/likes`);
            likeCounts[post._id] = likeRes.data.likes || 0;
            likedState[post._id] = false;
          } catch {
            likeCounts[post._id] = 0;
          }

          // Comments
          try {
            const res = await axios.get(`http://localhost:3001/comment/api/comments/${post._id}`);
            commentsMap[post._id] = res.data;
          } catch {
            commentsMap[post._id] = [];
          }
        }

        setLikesByPost(likeCounts);
        setCommentsByPost(commentsMap);
        setLikedPosts(likedState);
      } catch (err) {
        console.error("Erreur récupération des posts :", err);
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
      console.error("Erreur like post :", err);
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
        <div
          key={post._id}
          className="w-full sm:w-[calc(50%-0.5rem)] p-4 m-4 border border-gray-500 rounded-2xl shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">Auteur : {post.author}</span>
            <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</span>
          </div>

          <textarea
            readOnly
            value={post.content}
            rows={3}
            className="bg-white mt-2 block w-full rounded-md border border-gray-300 p-2"
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
              {commentsByPost[post._id]?.map(comment => (
                <CommentThread key={comment._id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CommentThread({ comment }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/comment/api/comments/${comment._id}/likes`,
          { withCredentials: true }
        );
        setLikes(res.data.likes || 0);
        setLiked(res.data.liked || false); // <-- récupère l'état liked du back
      } catch (err) {
        console.error("Erreur récupération des likes commentaire :", err);
      }
    };

    fetchLikes();
  }, [comment._id]);

  const handleLikeComment = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3001/comment/api/comments/${comment._id}/like`,
        {},
        { withCredentials: true }
      );
      const { likes: newLikes, liked: hasLiked } = res.data;
      setLikes(newLikes);
      setLiked(hasLiked); // <-- met à jour l'état du like
    } catch (err) {
      console.error("Erreur like commentaire :", err);
    }
  };

  return (
    <div className="ml-4 border-l-2 border-gray-300 pl-4 mt-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Auteur : {comment.author}</span>
        <span>{new Date(comment.createdAt).toLocaleString()}</span>
      </div>

      <p className="mt-1">{comment.content}</p>

      <div
        className="mt-2 flex items-center gap-2 cursor-pointer text-sm"
        onClick={handleLikeComment}
      >
        <span className={liked ? "text-red-500" : ""}>
          {liked ? "❤️" : "🤍"}
        </span>
        <span>{likes}</span>
      </div>

      {comment.replies?.length > 0 && (
        <div className="mt-2">
          {comment.replies.map(reply => (
            <CommentThread key={reply._id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
}
