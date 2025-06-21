require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// // ✅ CORS configuré proprement
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));

app.use(express.json());

const PORT = process.env.PORT || 4003;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté pour comment-service"))
  .catch(err => console.error("Erreur Mongo :", err));

app.use("/api/comments", require("./routes/comment.routes"));

app.listen(PORT, () => {
  console.log(`🚀 Comment service listening on port ${PORT}`);
});
