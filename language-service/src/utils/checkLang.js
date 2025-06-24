const mongoose = require("mongoose");
const Language = require("../models/language.model");

async function langExists(userId) {
  try {
    const lang = await Language.findOne({ userId: userId });
    return lang !== null;
  } catch (err) {
    console.error("Erreur lors de la recherche de langage :", err);
    return false;
  }
}

module.exports = { langExists };