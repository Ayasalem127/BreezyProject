const Messaging = require("../models/messaging.model");
const mongoose = require("mongoose");
const axios = require('axios');

exports.createMessage = async (req, res) => {
    try {
        console.log("Headers:", req.headers);
        const authorId = req.headers['x-user-id'];
        const { content, recipientId } = req.body;
        console.log("Paramètres OK");

        const userServiceUrl = `http://user-service:4001/api/users/${recipientId}`;

        let recipient;
        try {
            const response = await axios.get(userServiceUrl);
            recipient = response.data;
            console.log("Destinataire trouvé :", recipient.username || recipient.email || recipient.id);
        } catch (err) {
            console.error("Destinataire non trouvé dans user-service");
            return res.status(404).json({ error: "Destinataire inexistant." });
        }

        const message = await Messaging.create({
            authorId,
            recipientId,
            content
        });
        console.log("Création OK.");

        res.status(201).json(message);
        
    } catch (error) {
        console.error("Erreur lors de la création du message : ", error);
        res.status(500).json({ message: "Erreur serveur création message." });
    }
};

exports.getChats = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        // 1. Récupération des messages où l'utilisateur est soit auteur soit destinataire
        const messages = await Messaging.aggregate([
            {
                $match: {
                    $or: [
                        { authorId: userId },
                        { recipientId: userId }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$authorId", userId] },
                            "$recipientId",
                            "$authorId"
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" }
                }
            }
        ]);

        // 2. Pour chaque interlocuteur, enrichir avec infos utilisateur
        const enrichedMessages = await Promise.all(messages.map(async (msgGroup) => {
            const otherUserId = msgGroup._id;

            try {
                const response = await axios.get(`http://user-service:4001/api/users/${otherUserId}`);
                const { displayName, avatarUrl } = response.data;

                return {
                    ...msgGroup.lastMessage,
                    otherUser: {
                        userId: otherUserId,
                        displayName,
                        avatarUrl
                    }
                };
            } catch (error) {
                console.error(`Erreur lors de la récupération de l'utilisateur ${otherUserId} :`, error.message);
                return {
                    ...msgGroup.lastMessage,
                    otherUser: {
                        userId: otherUserId,
                        displayName: null,
                        avatarUrl: null
                    }
                };
            }
        }));

        res.status(200).json(enrichedMessages);
    } catch (error) {
        console.error("Erreur lors de la récupération des conversations : ", error);
        res.status(500).json({ message: "Erreur serveur récupération conversations." });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const me = req.headers['x-user-id'];
        const other = req.params.otherId;

        let meUserInfo = { displayName: null };
        try {
            const response = await axios.get(`http://user-service:4001/api/users/${me}`);
            meUserInfo = response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'utilisateur ${me} :`, error.message);
        }

        let otherUserInfo = { displayName: null };
        try {
            const response = await axios.get(`http://user-service:4001/api/users/${other}`);
            otherUserInfo = response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'utilisateur ${other} :`, error.message);
        }
        
        const messagesSend = await Messaging.find({ authorId: me, recipientId: other})
        .sort({ createdAt: 1});

        const messagesReceive = await Messaging.find({ authorId: other, recipientId: me})
        .sort({ createdAt: 1});

        const allMessages = [...messagesSend, ...messagesReceive];
        allMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        res.status(200).json({
            meId: me,
            meDisplayName: meUserInfo.displayName,
            meAvatar: meUserInfo.avatarUrl,
            otherDisplayName: otherUserInfo.displayName,
            otherAvatar: otherUserInfo.avatarUrl,
            messages: allMessages
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des messages : ", error);
        res.status(500).json({ message: "Erreur serveur récupération messages." });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const userId = req.headers['x-user-id'];

        if (!mongoose.Types.ObjectId.isValid(messageId)) {
            return res.status(404).json({ message: "ID de message invalide." });
        }

        const message = await Messaging.findById(messageId);

        if (message.authorId != userId) {
            return res.status(401).json({ message: "L'utilisateur n'est pas l'auteur." });
        }

        await message.deleteOne();
        res.status(200).json({ message: "Message supprimé" });

    } catch (error) {
        console.error("Erreur lors de la suppression du message : ", error);
        res.status(500).json({ message: "Erreur serveur suppression message." });
    }
};

exports.updateMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const authorId = req.headers['x-user-id'];
        const { content } = req.body;

        if (!mongoose.Types.ObjectId.isValid(messageId)) {
            return res.status(404).json({ message: "ID de message invalide." });
        }

        const message = await Messaging.findById(messageId);

        if (message.authorId != authorId) {
            return res.status(401).json({ message: "L'utilisateur n'est pas l'auteur." });
        }

        //message.updateOne({ content });
        message.content = content;
        await message.save();
        res.status(200).json({ message: "Message mis à jour." });

    } catch (error) {
        console.error("Erreur lors de la mise à jour du message : ", error);
        res.status(500).json({ message: "Erreur serveur mise-à-jour message." });
    }
};