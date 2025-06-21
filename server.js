const express = require("express");
const fs = require("fs");
const path = require("path");
const natural = require("natural");
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const intents = JSON.parse(fs.readFileSync("./intents.json", "utf8")).intents;
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// Preprocess all patterns in advance
const trainingData = intents.map((intent) => {
  return {
    tag: intent.tags,
    patterns: intent.patterns.map((p) =>
      stemmer.tokenizeAndStem(p.toLowerCase()).join(" "),
    ),
    response: intent.response,
  };
});

// NLP Matching function
function matchIntent(userMessage) {
  const input = stemmer.tokenizeAndStem(userMessage.toLowerCase()).join(" ");
  let bestMatch = {
    tag: null,
    score: 0,
    response: "I'm sorry, I didn't understand that.",
  };

  for (const intent of trainingData) {
    for (const pattern of intent.patterns) {
      const distance = natural.JaroWinklerDistance(input, pattern);
      if (distance > bestMatch.score) {
        bestMatch = {
          tag: intent.tag,
          score: distance,
          response:
            intent.response[Math.floor(Math.random() * intent.response.length)],
        };
      }
    }
  }

  return bestMatch.score > 0.75
    ? bestMatch.response
    : "I'm sorry, I didn't understand that.";
}

// Route
app.post("/chat", (req, res) => {
  const userMessage = req.body.message;
  const botResponse = matchIntent(userMessage);
  res.json({ response: botResponse });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
