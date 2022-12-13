const fs = require('fs');
const CsvReadableStream = require('csv-reader');
const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');

async function englishAnalysis(text) {
  const spellCorrector = new SpellCorrector();
  spellCorrector.loadDictionary();

  // Changing apostrophes to lexigrams. (I'm -> I am)
  const lexedReview = aposToLexForm(text);

  // Setting text in lowercase
  const casedReview = lexedReview.toLowerCase();

  // Taking just letters
  const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

  // Separating in tokens (words)
  // const { WordTokenizer } = natural;
  // const tokenizer = new WordTokenizer();
  // const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

  // // Checking spelling
  // tokenizedReview.forEach((word, index) => {
  //   tokenizedReview[index] = spellCorrector.correct(word);
  // });

  // Removing stop words (but, with, and, etc.)
  // const filteredReview = SW.removeStopwords(tokenizedReview);

  // Leaving just unique words
  // const uniqueWords = new Set(filteredReview);

  // console.log(uniqueWords);
  // if (!uniqueWords.size) return false;

  const hasBadEnglishWords = await findBadWords('bad-english.csv', alphaOnlyReview);
  if (hasBadEnglishWords) return true;

  // const hasBadSpanishWords = await findBadWords('bad-spanish.csv', uniqueWords);
  // if (hasBadSpanishWords) return true;

  return false;
}

async function spanishAnalysis(text) {
  // Setting all the text to lower case
  const casedReview = text.toLowerCase();

  // Taking just letters
  const alphaOnlyReview = casedReview.replace(/[^a-zA-ZáéíñóúüÁÉÍÑÓÚÜ\s]+/g, '');

  // Normalizing text
  const normalizedText = alphaOnlyReview
    .replace(/[ñ]/g, 'ni')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Separating text in tokens (words)
  const tokenizedReview = normalizedText.split(' ');

  // Leaving just unique words
  const uniqueWords = new Set(tokenizedReview);

  console.log(uniqueWords.size);
  if (!uniqueWords.size) return false;

  const hasBadSpanishWords = await findBadWords('bad-spanish.csv', uniqueWords);
  if (hasBadSpanishWords) return true;

  const hasBadEnglishWords = await findBadWords('bad-english.csv', uniqueWords);
  if (hasBadEnglishWords) return true;

  return false;
}

function findBadWords(filePath, uniqueWords) {
  return new Promise((resolve, reject) => {
    console.log('que hay: ', uniqueWords);
    let inputStream = fs.createReadStream(__dirname + '/' + filePath, 'utf8');

    inputStream
      .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
      .on('data', function ([row]) {
          if (uniqueWords.includes(row)) {
            console.log('BAD WORD DETECTED!!! ', row);
            resolve(true);
          }
      })
      .on('end', function () {
          console.log('No more rows!');
          resolve(false);
      });
  });
}

module.exports = {
  englishAnalysis,
  spanishAnalysis,
};
