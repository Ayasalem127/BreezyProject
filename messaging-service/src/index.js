require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const messagingRoutes = require('./routes/messaging.routes');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4006;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connecté pour messaging-service."))
  .catch(err => console.error("Erreur Mongo:", err));

app.use('/messaging', messagingRoutes);

app.listen(PORT, () => {
  console.log(`Messaging service listening on port ${PORT}.`);
});