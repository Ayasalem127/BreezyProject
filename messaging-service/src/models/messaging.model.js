const mongoose = require("mongoose");

const messagingSchema = new mongoose.Schema({

    authorId: {
        type: String,
        required: true
    },

    recipientId: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Messaging = mongoose.model("Messaging", messagingSchema);

module.exports = Messaging;