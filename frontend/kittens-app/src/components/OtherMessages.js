// 'use client';
// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function Messages() {
//     const messages = [["username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 1], ["username", "/logo.webp", "01/01/2001", "J'ai écris ce message.", 5, 1]];

//     const [likes, setLikes] = useState(Array(messages.length).fill(false));
//     const [isVisible, setIsVisible] = useState(Array(messages.length).fill(false));

//     function toggleLike(index) {
//         const newLikes = [...likes];
//         newLikes[index] = !newLikes[index];
//         setLikes(newLikes);
//     }

//     function toggleResponse(index) {
//         const newIsVisible = [...isVisible];
//         newIsVisible[index] = !newIsVisible[index];
//         setIsVisible(newIsVisible);
//     }

//     const handleResponse = async (e, index) => {
//         e.preventDefault();

//         const response = e.target.elements[`response-${index}`].value;

//         //Affichage temporaire
//         console.log(`Réponse : ${response}`);
//     }

//     return (
//         <div className="flex flex-col items-center w-full px-4">
//             {messages.map((message, index) => (
//             <div key={index} style={{ boxShadow: "0 12px 32px var(--shadow-color)", borderColor: 'var(--input-border)' }} className="w-full sm:w-[calc(50%-0.5rem)] p-2 m-4 box-border flex flex-col justify-between border rounded-2xl">
//                 <div className="flex items-center gap-3 w-full">
//                     <img src={message[1]} alt="logo" className="w-10 h-10 object-contain mb-2 rounded-full"/>
//                     <span className="font-semibold">{message[0]}</span>
//                     <span className="flex ml-auto text-sm text-gray-500">{message[2]}</span>
//                 </div>

//                 <textarea readOnly id="message" value={message[3]} rows={3} className="focus:border-blue-500 focus:outline-none"/>
                
//                 <div className="flex justify-start gap-2 mt-3">
//                     <div className="flex flex-col items-center">
//                         <span id={`likeButton-${index}`} className="text-3xl cursor-pointer" onClick={() => toggleLike(index)} role="button" aria-label="like button">{likes[index] ? "❤️" : "🤍"}</span>
//                         <span id={`numberLikes-${index}`}>{message[4]}</span>
//                     </div>
//                     <div className="flex flex-col items-center">
//                         <span id={`responseButton-${index}`} className="text-3xl cursor-pointer" onClick={() => toggleResponse(index)} role="button" aria-label="response button">💬</span>
//                         <span id={`numberResponses-${index}`}>{message[5]}</span>
//                     </div>
//                 </div>

//                 <form onSubmit={(e) => handleResponse(e, index)} style={{display: isVisible[index] ? 'block' : 'none'}} className="rounded-lg w-full space-y-2">
//                     <div className="flex items-center gap-2">
//                         <img src={message[1]} alt="logo" className="w-10 h-10 object-contain mb-2 rounded-full"/>
//                         <textarea type="text" id={`response-${index}`} className="focus:border-blue-500 focus:outline-none" rows={3} placeholder="Ecrire ici..."/>
//                     </div>

//                     <div className="flex justify-end">
//                         <button type="submit">Publier</button>
//                     </div>
//                 </form>
//             </div>
//             ))}
//         </div>
//     );
// }



"use client";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";

axios.defaults.withCredentials = true;

export default function OtherMessages({ userId }) {
  const [posts, setPosts] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [likesByPost, setLikesByPost] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [isVisible, setIsVisible] = useState([]);
  const [authors, setAuthors] = useState({});
  const [displayName, setDisplayName] = useState("");

  const { user } = useContext(AuthContext);
  const viewerId = user?.userId || user?._id;
  
  const [translatedTexts, setTranslatedTexts] = useState([]);

    const textsToTranslate = ["Message de ", "Aucun message trouvé.", "Auteur", "Publier", "Répondre", "Valider", "Laisse parler ton coeur..."];

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
    if (!userId) return;

    const fetchData = async () => {
      try {
        const userRes = await axios.get(`http://localhost:3001/user/api/users/${userId}`);
        const profileUser = userRes.data;
        setDisplayName(profileUser.displayName);

        const realUserId = profileUser.userId;
        const postRes = await axios.get(`http://localhost:3001/post/api/posts/user/${realUserId}`);
        const postList = postRes.data;

        const likeCounts = {};
        const commentsMap = {};
        const likedState = {};
        const authorIds = new Set();

        for (const post of postList) {
          authorIds.add(post.author);

          try {
            const likeRes = await axios.get(`http://localhost:3001/post/api/posts/${post._id}/likes`);
            likeCounts[post._id] = likeRes.data.likes || 0;
            likedState[post._id] = likeRes.data.liked || false;
          } catch {
            likeCounts[post._id] = 0;
            likedState[post._id] = false;
          }

          try {
            const commentRes = await axios.get(`http://localhost:3001/comment/api/comments/${post._id}`);
            commentsMap[post._id] = commentRes.data;
            commentRes.data.forEach(c => {
              authorIds.add(c.author);
              c.replies?.forEach(r => authorIds.add(r.author));
            });
          } catch {
            commentsMap[post._id] = [];
          }
        }

        const enrichedAuthors = {};
        await Promise.all([...authorIds].map(async id => {
          try {
            const userRes = await axios.get(`http://localhost:3001/user/api/users/${id}`);
            enrichedAuthors[id] = userRes.data.displayName || id;
          } catch {
            enrichedAuthors[id] = id;
          }
        }));

        setPosts(postList);
        setIsVisible(postList.map(() => false));
        setAuthors(enrichedAuthors);
        setLikesByPost(likeCounts);
        setLikedPosts(likedState);
        setCommentsByPost(commentsMap);
      } catch (err) {
        console.error("❌ Erreur chargement OtherMessages :", err);
      }
    };

    fetchData();
  }, [userId]);

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
      <h2 className="text-xl font-semibold mb-4">{translatedTexts[0]}{displayName}</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">{translatedTexts[1]}</p>
      ) : (
        posts.map((post, index) => (
          <div key={post._id} className="w-full sm:w-[calc(50%-0.5rem)] p-4 m-4 border border-gray-300 rounded-2xl shadow">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">{translatedTexts[2]} : {authors[post.author]}</span>
              <span className="text-gray-500">{new Date(post.createdAt).toLocaleString()}</span>
            </div>

            <textarea readOnly value={post.content} rows={3} className="w-full p-2 mt-2 border rounded" />

            <div className="flex gap-6 mt-3 text-xl">
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
                  translatedTexts={translatedTexts}
                  onCommentAdded={(newComment) => {
                    setCommentsByPost(prev => ({
                      ...prev,
                      [post._id]: [...(prev[post._id] || []), newComment]
                    }));
                  }}
                />
                {commentsByPost[post._id]?.map(comment => (
                  <CommentThread key={comment._id} comment={comment} authors={authors} viewerId={viewerId} translatedTexts={translatedTexts} />
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function AddComment({ postId, translatedTexts, onCommentAdded }) {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      const res = await axios.post(`http://localhost:3001/comment/api/comments/${postId}`, { content });
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
        placeholder={translatedTexts[6] || "Laisse parler ton coeur..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
      />
      <button onClick={handleSubmit} className="mt-1 px-3 py-1 bg-green-600 text-white rounded">
        {translatedTexts[3] || "Publier"}
      </button>
    </div>
  );
}

function CommentThread({ comment, authors, viewerId, translatedTexts }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [replyContent, setReplyContent] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/comment/api/comments/${comment._id}/likes`);
        setLikes(res.data.likes);
        setLiked(res.data.liked);
      } catch (err) {
        console.log("Erreur récupération likes commentaire :", err);
      }
    };

    fetchLikes();
  }, [comment._id]);

  const handleLike = async () => {
    try {
      const res = await axios.post(`http://localhost:3001/comment/api/comments/${comment._id}/like`);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch (err) {
      console.log("Erreur like commentaire :", err);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    try {
      const res = await axios.post(`http://localhost:3001/comment/api/comments/reply/${comment._id}`, { content: replyContent });
      setReplies(prev => [...prev, res.data]);
      setReplyContent("");
      setShowReplyBox(false);
    } catch (err) {
      console.log("Erreur envoi réponse :", err.response?.data || err.message);
    }
  };

  return (
    <div className="ml-4 border-l-2 border-blue-300 pl-4 mt-4 bg-blue-50 p-2 rounded">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{authors[comment.author] || comment.author}</span>
        <span>{new Date(comment.createdAt).toLocaleString()}</span>
      </div>
      <p className="mt-1">{comment.content}</p>
      <div className="flex gap-3 mt-2 text-sm">
       <span
  onClick={handleLike}
  className={`cursor-pointer transition-colors ${liked ? "text-red-500" : "text-gray-500"}`}
>
  {liked ? "❤️" : "🤍"} {likes}
</span>

        <button onClick={() => setShowReplyBox(prev => !prev)} className="text-blue-600">
          {translatedTexts[4]}
        </button>
      </div>
      {showReplyBox && (
        <div className="mt-2">
          <textarea
            className="w-full p-2 border rounded"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Votre réponse..."
            rows={2}
          />
          <button onClick={handleReply} className="mt-1 px-3 py-1 bg-blue-600 text-white rounded">
            {translatedTexts[5]}
          </button>
        </div>
      )}
      {replies.length > 0 && (
        <div className="mt-3 space-y-2">
          {replies.map(reply => (
            <CommentThread key={reply._id} comment={reply} authors={authors} viewerId={viewerId} translatedTexts={translatedTexts} />
          ))}
        </div>
      )}
    </div>
  );
}
