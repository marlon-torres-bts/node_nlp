const express = require('express');
const sentiment = require('node-sentiment');

const router = express.Router();

router.post('/analyzer', (req, res) => {
  const { text } = req.body;
  const textSentiment = sentiment(text, 'en');

  console.log(textSentiment);

  res.status(200).json({ textSentiment });
});

module.exports = router;
