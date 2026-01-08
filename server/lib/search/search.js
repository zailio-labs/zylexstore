const natural = require('natural');
const fs = require('fs');
const path = require('path');

const words = fs.readFileSync(path.join(__dirname, 'words.txt')).toString().split('\n');
const spellcheck = new natural.Spellcheck(words);

const searchCurrect = (w) => {
  const tokens = w.split(' ');
    const correctedTokens = tokens.map(token => {
        if (spellcheck.isCorrect(token)) {
            return token;
        } else {
            const suggestions = spellcheck.getCorrections(token, 1);
            return suggestions.length > 0 ? suggestions[0] : token;
        }
    });
    return correctedTokens.join(' ');
};
module.exports = { searchCurrect};
