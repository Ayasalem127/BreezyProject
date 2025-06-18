require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");
const app = express();
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

console.log("__dirname backend = ", __dirname);

const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connecté pour user-service"))
  .catch(err => console.error("Erreur Mongo:", err));

app.use('/api/users', require('./routes/userRoutes'));

app.listen(PORT, () => {
  console.log(` User service listening on port ${PORT}`);
});

