require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connecté pour user-service"))
  .catch(err => console.error("Erreur Mongo:", err));

app.use('/api/users', require('./routes/userRoutes'));

app.listen(PORT, () => {
  console.log(`🚀 User service listening on port ${PORT}`);
});
