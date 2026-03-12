const fs = require('fs');
const path = require('path');

let currentLang = "id";
let translations = {};

function loadLanguage(lang){
    currentLang = lang;
    const filePath = path.join(__dirname, '../locales', lang + '.json');
    translations = JSON.parse(fs.readFileSync(filePath));
}

function t(key){
    return translations[key] || key;
}

module.exports = { loadLanguage, t };