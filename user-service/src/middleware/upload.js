const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadPath = path.join(__dirname, "..", "..", "uploads"); // ✅ remonte bien au bon dossier

console.log("📂 __dirname       :", __dirname);
console.log("📂 Upload path     :", uploadPath);
console.log("📂 Path absolu test:", path.resolve(uploadPath));
// Crée le dossier si manquant
if (!fs.existsSync(uploadPath)) {
  console.log("📁 Upload folder n'existe pas, création...");
  fs.mkdirSync(uploadPath, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
   // cb(null, uploadDir);
   cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
module.exports = upload;
