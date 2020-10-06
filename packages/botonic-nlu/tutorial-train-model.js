const { BotonicNLU } = require('./dist');
const natural = require('natural');

const normalizer = {
  normalize: (sentence) => sentence.toLowerCase(),
};

const stemmer = {
  stem: (sentence, language) => {
    return sentence;
    switch (language) {
      case 'en':
        return natural.PorterStemmer.stem(sentence);
      case 'fr':
        return natural.PorterStemmerFr.stem(sentence);
      case 'it':
        return natural.PorterStemmerIt.stem(sentence);
      case 'no':
        return natural.PorterStemmerNo.stem(sentence);
      case 'es':
        return natural.PorterStemmerEs.stem(sentence);
      case 'pt':
        return natural.PorterStemmerPt.stem(sentence);
      case 'ru':
        return natural.PorterStemmerRu.stem(sentence);
      default:
        return sentence;
    }
  },
};

const tokenizer = new natural.TreebankWordTokenizer();

const nlu = new BotonicNLU();

nlu.normalizer = normalizer;
nlu.stemmer = stemmer;
nlu.tokenizer = tokenizer;

const dataPath =
  '/Users/mrabat/Documents/hubtype/botonic/packages/botonic-nlu/tests/nlu/utterances/en/data.csv';
const language = 'en';
const maxSeqLen = 20;
nlu.loadData(dataPath, language, maxSeqLen);

const testPercentage = 0.2;
nlu.splitData(testPercentage);

const learningRate = 0.00005;
const epochs = 2;
const batchSize = 8;
(async () => {
  await nlu.createModel(learningRate);
  await nlu.train(epochs, batchSize);
  const accuracy = await nlu.evaluate();
  await nlu.saveModel();
})();

// nlu.train(language, maxSeqLen);
