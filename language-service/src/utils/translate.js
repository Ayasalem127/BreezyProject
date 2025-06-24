/*const translate = require('@vitalets/google-translate-api').translate;

async function translateText(text, to) {
  try {
    const result = await translate(text, { to, from: "fr" });
    return result.text;
  } catch (error) {
    console.error("Erreur de traduction :", error);
    return null;
  }
}*/

const axios = require("axios");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const translateText = async (text, to, from = "fr") => {

  await sleep(200);
  
  const subscriptionKey = "A2knQIT8pnHQYvczNq2m481aju5A6jtbmv4VGT2eotb6Af6Y2mXUJQQJ99BFAC5T7U2XJ3w3AAAbACOGjGlN";
  const endpoint = "https://devweb.cognitiveservices.azure.com/";
  const location = "francecentral";

  const url = `${endpoint}/translator/text/v3.0/translate?from=${from}&to=${to}`;

  try {
    const res = await axios.post(
      url,
      [{ Text: text }],
      {
        headers: {
          "Ocp-Apim-Subscription-Key": subscriptionKey,
          "Ocp-Apim-Subscription-Region": location,
          "Content-type": "application/json",
        },
      }
    );

    console.log(res.data[0].translations[0].text);
    return res.data[0].translations[0].text;

  } catch (err) {
    console.error("Erreur Azure Translator:", err.response?.data || err.message);
    return null;
  }
};


const googleLanguages = {
  "af": "Afrikaans",
  "sq": "Albanian",
  "am": "Amharic",
  "ar": "Arabic",
  "hy": "Armenian",
  "az": "Azerbaijani",
  "eu": "Basque",
  "be": "Belarusian",
  "bn": "Bengali",
  "bs": "Bosnian",
  "bg": "Bulgarian",
  "ca": "Catalan",
  "ceb": "Cebuano",
  "ny": "Chichewa",
  "zh-CN": "Chinese (Simplified)",
  "zh-TW": "Chinese (Traditional)",
  "co": "Corsican",
  "hr": "Croatian",
  "cs": "Czech",
  "da": "Danish",
  "nl": "Dutch",
  "en": "English",
  "eo": "Esperanto",
  "et": "Estonian",
  "tl": "Filipino",
  "fi": "Finnish",
  "fr": "French",
  "fy": "Frisian",
  "gl": "Galician",
  "ka": "Georgian",
  "de": "German",
  "el": "Greek",
  "gu": "Gujarati",
  "ht": "Haitian Creole",
  "ha": "Hausa",
  "haw": "Hawaiian",
  "he": "Hebrew",
  "hi": "Hindi",
  "hmn": "Hmong",
  "hu": "Hungarian",
  "is": "Icelandic",
  "ig": "Igbo",
  "id": "Indonesian",
  "ga": "Irish",
  "it": "Italian",
  "ja": "Japanese",
  "jw": "Javanese",
  "kn": "Kannada",
  "kk": "Kazakh",
  "km": "Khmer",
  "ko": "Korean",
  "ku": "Kurdish (Kurmanji)",
  "ky": "Kyrgyz",
  "lo": "Lao",
  "la": "Latin",
  "lv": "Latvian",
  "lt": "Lithuanian",
  "lb": "Luxembourgish",
  "mk": "Macedonian",
  "mg": "Malagasy",
  "ms": "Malay",
  "ml": "Malayalam",
  "mt": "Maltese",
  "mi": "Maori",
  "mr": "Marathi",
  "mn": "Mongolian",
  "my": "Myanmar (Burmese)",
  "ne": "Nepali",
  "no": "Norwegian",
  "ps": "Pashto",
  "fa": "Persian",
  "pl": "Polish",
  "pt": "Portuguese",
  "pa": "Punjabi",
  "ro": "Romanian",
  "ru": "Russian",
  "sm": "Samoan",
  "gd": "Scots Gaelic",
  "sr": "Serbian",
  "st": "Sesotho",
  "sn": "Shona",
  "sd": "Sindhi",
  "si": "Sinhala",
  "sk": "Slovak",
  "sl": "Slovenian",
  "so": "Somali",
  "es": "Spanish",
  "su": "Sundanese",
  "sw": "Swahili",
  "sv": "Swedish",
  "tg": "Tajik",
  "ta": "Tamil",
  "te": "Telugu",
  "th": "Thai",
  "tr": "Turkish",
  "uk": "Ukrainian",
  "ur": "Urdu",
  "ug": "Uyghur",
  "uz": "Uzbek",
  "vi": "Vietnamese",
  "cy": "Welsh",
  "xh": "Xhosa",
  "yi": "Yiddish",
  "yo": "Yoruba",
  "zu": "Zulu"
};

module.exports = { translateText, googleLanguages };