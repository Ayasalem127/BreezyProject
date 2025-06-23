const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); 

const notificationRoutes = require("./routes/notification.routes");

const app = express();
const cookieParser = require('cookie-parser');



app.use(express.json()); // pour parser le JSON

app.use(cookieParser());
app.use("/api/notifications", notificationRoutes);



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
