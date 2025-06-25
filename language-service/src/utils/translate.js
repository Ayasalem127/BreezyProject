const axios = require("axios");

const subscriptionKey = "A2knQIT8pnHQYvczNq2m481aju5A6jtbmv4VGT2eotb6Af6Y2mXUJQQJ99BFAC5T7U2XJ3w3AAAbACOGjGlN";
const endpoint = "https://devweb.cognitiveservices.azure.com/";
const location = "francecentral";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const translateTexts = async (texts, to, from = "fr", retry = 5) => {
  await sleep(200);

  const isArray = Array.isArray(texts);
  const inputTexts = isArray ? texts : [texts];

  const validTexts = inputTexts.filter(t => typeof t === 'string' && t.trim() !== '');

  if (validTexts.length === 0) {
    console.warn("Aucun texte valide à traduire.");
    return Array.isArray(texts) ? [] : null;
  }

  const url = `${endpoint}/translator/text/v3.0/translate?from=${from}&to=${to}`;

  try {
    const res = await axios.post(
      url,
      validTexts.map((t) => ({ Text: t })),
      {
        headers: {
          "Ocp-Apim-Subscription-Key": subscriptionKey,
          "Ocp-Apim-Subscription-Region": location,
          "Content-type": "application/json",
        },
      }
    );

    const translations = res.data.map(item => item.translations[0].text);
    return Array.isArray(texts) ? translations : translations[0];

  } catch (err) {
    if (err.response?.status === 429 && retry > 0) {
      await sleep(1000);
      return translateTexts(texts, to, from, retry - 1);
    }

    console.error("Erreur Azure Translator (batch) :", err.response?.data || err.message);
    return Array.isArray(texts) ? texts.map(() => null) : null;
  }
};

const getAvailableLanguages = async () => {
  const url = `${endpoint}/translator/text/v3.0/languages?api-version=3.0&scope=translation`;

  try {
    const res = await axios.get(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Ocp-Apim-Subscription-Region": location,
      },
    });

    const languages = res.data.translation;

    return Object.entries(languages).map(([code, info]) => ({
      code,
      name: info.name,
    }));
    
  } catch (err) {
    console.error("Erreur récupération langues Azure:", err.response?.data || err.message);
    throw err;
  }
};


module.exports = { translateTexts, getAvailableLanguages };