// keywordEngine.js

const scamKeywords = [

    "urgent",
    "send money",
    "verify account",
    "password",
    "bank alert",
    "lottery",
    "winner",
    "claim prize",
    "click link",
    "limited time"

];

exports.detectKeywords = (message) => {

    let matches = [];

    const lowerMessage = message.toLowerCase();

    scamKeywords.forEach(keyword => {

        if (lowerMessage.includes(keyword)) {

            matches.push(keyword);

        }

    });

    return matches;
};
