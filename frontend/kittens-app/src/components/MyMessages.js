'use client';
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
export default function MyMessages() {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isVisible, setIsVisible] = useState([]);
  const [messageTexts, setMessageTexts] = useState([]);
  const [notification, setNotification] = useState("");
  const [likesByPost, setLikesByPost] = useState({});
  const [commentsByPost, setCommentsByPost] = useState({});

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

        await Promise.all(postList.map(async (post) => {
          try {
            const likeRes = await axios.get(`http://localhost:3001/post/api/posts/${post._id}/likes`, { withCredentials: true });
            likesMap[post._id] = likeRes.data.likes || 0;
          } catch {
            likesMap[post._id] = 0;
          }

          try {
            const commentRes = await axios.get(`http://localhost:3001/comment/api/comments/${post._id}`, { withCredentials: true });
            commentsMap[post._id] = commentRes.data.length;
          } catch {
            commentsMap[post._id] = 0;
          }
        }));

        setLikesByPost(likesMap);
        setCommentsByPost(commentsMap);
      } catch (err) {
        console.error("Erreur chargement posts :", err);
      }
    };

    fetchPosts();
  }, []);

  const toggleLike = (index) => {
    const newLikes = [...likes];
    newLikes[index] = !newLikes[index];
    setLikes(newLikes);
  };

  const toggleResponse = (index) => {
    const newIsVisible = [...isVisible];
    newIsVisible[index] = !newIsVisible[index];
    setIsVisible(newIsVisible);
  };

  const handleModification = async (e, index) => {
    e.preventDefault();

    const postId = posts[index]._id;
    const newContent = messageTexts[index];

    try {
      const response = await axios.put(
        `http://localhost:3001/post/api/posts/${postId}`,
        { content: newContent },
        { withCredentials: true }
      );

      const updatedPosts = [...posts];
      updatedPosts[index].content = newContent;
      setPosts(updatedPosts);
      setNotification("Post modifié avec succès ✅");
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      console.error("Erreur lors de la modification :", err.response?.data || err.message);
      setNotification("Erreur lors de la modification ❌");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const handleResponse = async (e, index) => {
    e.preventDefault();
    const responseText = e.target.elements[`response-${index}`].value;
    console.log(`Réponse envoyée : ${responseText}`);
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
            <form onSubmit={(e) => handleModification(e, index)} className="rounded-lg w-full space-y-2">
              <div className="flex items-center gap-3 w-full">
                <img src={message.avatarUrl} alt="avatar" className="w-10 h-10 object-contain mb-2 rounded-full" />
                <span className="font-semibold">{message.author}</span>
                <span className="flex ml-auto text-sm text-gray-500">
                  {new Date(message.createdAt).toLocaleDateString()}
                </span>
              </div>

              <textarea
                id={`message-${index}`}
                value={messageTexts[index]}
                onChange={(e) => {
                  const newTexts = [...messageTexts];
                  newTexts[index] = e.target.value;
                  setMessageTexts(newTexts);
                }}
                rows={3}
                className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              />

              <div className="flex justify-start gap-6 mt-3">
                <div className="flex flex-col items-center">
                  <span
                    className="text-3xl cursor-pointer"
                    onClick={() => toggleLike(index)}
                    role="button"
                    aria-label="like button"
                  >
                    {likes[index] ? "❤️" : "🤍"}
                  </span>
                  <span>{likesByPost[message._id] || 0}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span
                    className="text-3xl cursor-pointer"
                    onClick={() => toggleResponse(index)}
                    role="button"
                    aria-label="response button"
                  >
                    💬
                  </span>
                  <span>{commentsByPost[message._id] || 0}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Modifier
                </button>
              </div>
            </form>

            <form
              onSubmit={(e) => handleResponse(e, index)}
              style={{ display: isVisible[index] ? "block" : "none" }}
              className="rounded-lg w-full space-y-2 mt-3"
            >
              <div className="flex items-center gap-2">
                <img src={message.avatarUrl} alt="logo" className="w-10 h-10 object-contain mb-2 rounded-full" />
                <textarea
                  id={`response-${index}`}
                  className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  rows={3}
                  placeholder="Ecrire ici..."
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                  Publier
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

