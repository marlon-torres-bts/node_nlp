const express = require('express');
const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');
const LanguageDetect = require('languagedetect');
const { spanishAnalysis, englishAnalysis } = require('../utils/sentiment-analyzer');

const router = express.Router();

const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

const lngDetector = new LanguageDetect();

router.post('/s-analyzer', async function(req, res, next) {
  const { review } = req.body;

  const languageDetected = lngDetector
    .detect(review, 5)
    .find(([lang]) => ['english', 'spanish'].includes(lang));

  const hasBadWords = languageDetected && languageDetected[0] === 'spanish'
    ? await englishAnalysis(review)
    : await englishAnalysis(review);

  console.log('bad words: ', hasBadWords);

  res.status(200).json({ hasBadWords });
});

module.exports = router;
