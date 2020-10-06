const { NewBotonicNLU } = require('./dist');
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

const nlu = new NewBotonicNLU();

nlu.normalizer = normalizer;
nlu.stemmer = stemmer;
nlu.tokenizer = tokenizer;

const modelDataPath =
  '/home/eric/Git/botonic/packages/botonic-nlu-refactored/tests/nlu/models/en/model-data.json';
nlu.loadModelData(modelDataPath);

const modelPath =
  '/home/eric/Git/botonic/packages/botonic-nlu-refactored/tests/nlu/models/en/model.json';

(async () => {
  await nlu.loadModel(modelPath);
  const prediction = nlu.predict('Thank you very much!');
  console.log(prediction);
})();
