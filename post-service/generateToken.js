const jwt = require("jsonwebtoken");

//user simulé pour les tests
const user = {
  id: "12345",
  username: "testuser",
  role: "user"
};

//Attention : la clé doit être IDENTIQUE à celle du .env du post-service
const token = jwt.sign(user, "your_shared_jwt_secret", { expiresIn: "1d" });
console.log("Token de test à utiliser dans Postman :\n");
console.log(token);


// const alice = {
//   id: "67890",
//   username: "alice",
//   role: "user"
// };

// const token = jwt.sign(alice, "your_shared_jwt_secret", { expiresIn: "1h" });
// console.log("Alice token:\n", token);

// const bob = {
//   id: "abcde123",
//   username: "bob",
//   role: "user"
// };

// const token = jwt.sign(bob, "your_shared_jwt_secret", { expiresIn: "1h" });
// console.log("Bob token:\n", token);


//d'abord run avec la commande : node generateToken.js 
//pour avoir un token de test
//et ensuite test sur postman avec le token dans le header