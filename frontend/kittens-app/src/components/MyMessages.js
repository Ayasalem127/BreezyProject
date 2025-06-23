'use client';
import { useState, useEffect } from "react";
import axios from "axios";

export default function MyMessages() {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isVisible, setIsVisible] = useState([]);
  const [messageTexts, setMessageTexts] = useState([]);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    axios.get('http://localhost:3001/post/api/posts/me', { withCredentials: true })
      .then(res => {
        setPosts(res.data);
        setLikes(res.data.map(() => false));
        setIsVisible(res.data.map(() => false));
        setMessageTexts(res.data.map(p => p.content));
      })
      .catch(err => console.error(err));
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

      // Met à jour localement
      const updatedPosts = [...posts];
      updatedPosts[index].content = newContent;
      setPosts(updatedPosts);
      setNotification("Post modifié avec succès ");
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      console.error("Erreur modification :", err.response?.data || err.message);
      setNotification("Erreur lors de la modification ");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const handleResponse = async (e, index) => {
    e.preventDefault();
    const response = e.target.elements[`response-${index}`].value;
    console.log(`Réponse : ${response}`);
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
                <img src={message.avatarUrl} alt="logo" className="w-10 h-10 object-contain mb-2 rounded-full" />
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
                    id={`likeButton-${index}`}
                    className="text-3xl cursor-pointer"
                    onClick={() => toggleLike(index)}
                    role="button"
                    aria-label="like button"
                  >
                    {likes[index] ? "❤️" : "🤍"}
                  </span>
                  <span id={`numberLikes-${index}`}>{message.likes}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span
                    id={`responseButton-${index}`}
                    className="text-3xl cursor-pointer"
                    onClick={() => toggleResponse(index)}
                    role="button"
                    aria-label="response button"
                  >
                    💬
                  </span>
                  <span id={`numberResponses-${index}`}>{message.responses}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="w-30">
                  <button type="submit" className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Modifier
                  </button>
                </div>
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
                  type="text"
                  id={`response-${index}`}
                  className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  rows={3}
                  placeholder="Ecrire ici..."
                />
              </div>

              <div className="flex justify-end">
                <div className="w-30">
                  <button type="submit" className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                    Publier
                  </button>
                </div>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
