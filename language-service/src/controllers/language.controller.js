const { translateText, getAvailableLanguages } = require('../utils/translate');
const { userExists } = require('../utils/checkUser');
const { langExists } = require('../utils/checkLang');
const mongoose = require("mongoose");
const Language = require("../models/language.model");

/*exports.getWelcomeMessage = async (req, res) => {
  const { language } = req.body;
  const msg = "Bienvenue dans notre application !";

  const translated = await translateText(msg, language);
  if (!translated) return res.status(500).json({ error: "Erreur de traduction" });

  res.status(200).json({ message: translated });
};*/

exports.createLanguage = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        const user = await userExists(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        } else {
            const lang = await langExists(userId);
            if (!lang) {
                try {
                    const newLang = await Language.create({
                        userId
                    });
                    console.log("Création OK.");
                    return res.status(200).json({ message: "Langage créé." });
                } catch {
                    return res.status(500).json({ message: "Erreur serveur création d'un langage." });
                }
            } else {
                return res.status(400).json({ message: "Le langage existe déjà." });
            }
        }
    } catch (error) {
        console.error("Erreur lors de la création du langage : ", error);
        res.status(500).json({ message: "Erreur serveur création langage." });
    }
}

exports.updateLanguage = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { targetLanguage } = req.body;

        const user = await userExists(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        } else {
            const lang = await langExists(userId);
            if (!lang) {
                try {
                    const newLang = await Language.create({
                        userId
                    });
                    console.log("Création OK.");
                    res.status(200).json({ message: "Langage créé." });
                } catch {
                    res.status(500).json({ message: "Erreur serveur création d'un langage." });
                }
            } else {
                try {
                    const language = await Language.findOne({ userId: userId });
                    language.language = targetLanguage;
                    await language.save();
                    res.status(200).json({ message: "Langage mis à jour." });
                } catch {
                    res.status(500).json({ message: "Erreur serveur modification d'un langage." });
                }
            }
        }
    } catch (error) {
        console.error("Erreur lors de la modification du langage : ", error);
        res.status(500).json({ message: "Erreur serveur modification langage." });
    }
}

exports.getLanguages = async (req, res) => {
    try {
        const languages = await getAvailableLanguages();
        res.status(200).json(languages);
        
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur récupération langages." });
    }
}

async function getLanguageByUser (req, res = null) {
    const userId = req.headers['x-user-id'];

    try {
        const language = await Language.findOne({ userId: userId });
        return language?.language || "fr";

    } catch (error) {
        console.error("Erreur lors de la récupération du langage : ", error);
        return("fr");
    }
}

exports.translate = async (req, res) => {
    const to = await getLanguageByUser(req);
    console.log(to);
    const { text } = req.body;

    try {
        const translated = await translateText(text, to);
        if (!translated) {
            return res.status(500).json({ error: "Erreur de traduction" });
        }

        res.status(200).json({ message: translated });

    } catch (error) {
        console.error("Erreur lors de la traduction : ", error);
        res.status(500).json({ message: "Erreur serveur traduction." });
    }
}