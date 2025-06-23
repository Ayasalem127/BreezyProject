const axios = require('axios');

async function userExists(userId) {
    console.log(userId);
    const userServiceUrl = `http://user-service:4001/api/users/${userId}`;

    try {
        const response = await axios.get(userServiceUrl);
        const user = response.data;
        console.log("Utilisateur trouvé", user._id);
        return true;
    } catch (err) {
        console.error("Utilisateur non trouvé dans user-service");
        return false;
    }
}

module.exports = { userExists };