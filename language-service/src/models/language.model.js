const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
        unique: true
    },

    language: {
        type: String,
        default: "fr"
    }
});


const Language = mongoose.model("Language", languageSchema);

module.exports = Language;