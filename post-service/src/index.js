const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); 

const postRoutes = require("./routes/post.routes");

const app = express();


app.use(cors());        // Middleware
app.use(express.json()); // pour parser le JSON


app.use("/api/posts", postRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connecté à MongoDB");

    app.listen(process.env.PORT, () => {
      console.log(`Post-service lancé sur le port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion MongoDB :", err);
  });
