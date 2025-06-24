require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const languageRoutes = require('./routes/language.routes');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4007;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connecté pour language-service."))
  .catch(err => console.error("Erreur Mongo:", err));

app.use('/language', languageRoutes);

app.listen(PORT, () => {
  console.log(`Language service listening on port ${PORT}.`);
});