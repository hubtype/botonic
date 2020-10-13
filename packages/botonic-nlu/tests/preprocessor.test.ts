import { DefaultNormalizer } from '../src/preprocessing-tools/normalizer';
import { DefaultStemmer } from '../src/preprocessing-tools/stemmer';
import { DefaultTokenizer } from '../src/preprocessing-tools/tokenizer';
import { Preprocessor } from '../src/preprocessor';
import * as CONSTANTS from '../src/constants';

describe('Preprocessor Tools', () => {
  test('Normalizing a sentence', () => {
    const normalizer = new DefaultNormalizer();
    const sentence = 'Today I am going to the office!';
    const expectedOutput = 'today i am going to the office!';
    expect(normalizer.normalize(sentence)).toEqual(expectedOutput);
  });
  test('Tokenizing a sentence', () => {
    const tokenizer = new DefaultTokenizer();
    const sentence = 'today i am going to the office!';
    const expectedOutput = [
      'today',
      'i',
      'am',
      'going',
      'to',
      'the',
      'office',
      '!',
    ];
    expect(tokenizer.tokenize(sentence)).toEqual(expectedOutput);
  });
  test('Stemming a sentence', () => {
    const stemmer = new DefaultStemmer(true);
    const language = 'en';
    const tokens = ['today', 'i', 'am', 'going', 'to', 'the', 'office', '!'];
    const expectedOutputs = [
      'todai',
      'i',
      'am',
      'go',
      'to',
      'the',
      'offic',
      '!',
    ];
    tokens.forEach((token, i) => {
      expect(stemmer.stem(token, language)).toEqual(expectedOutputs[i]);
    });
  });
});

describe('Preprocessor', () => {
  test('Generating a vocabulary', () => {
    const preprocessor = new Preprocessor();
    const data = [
      { label: 'Greetings', feature: 'Hi!' },
      { label: 'BookRestaurant', feature: 'I want to book a table' },
      { label: 'BuyClothes', feature: 'I would like to buy these trousers' },
    ];
    const expectedVocabulary = {
      '<UNK>': 0,
      hi: 1,
      '!': 2,
      i: 3,
      want: 4,
      to: 5,
      book: 6,
      a: 7,
      table: 8,
      would: 9,
      like: 10,
      buy: 11,
      these: 12,
      trousers: 13,
    };
    const generatedVocabulary = preprocessor.generateVocabulary(data);
    expect(generatedVocabulary).toEqual(expectedVocabulary);
  });
  test('Preprocessing a sentence', () => {
    const language = 'en';
    const maxSeqLen = 10;
    const vocabulary = {
      [CONSTANTS.UNKNOWN_TOKEN]: 0,
      the: 1,
      today: 2,
      office: 3,
      i: 4,
      am: 5,
      going: 6,
      to: 7,
      '!': 8,
    };
    const sentence = 'Today I am going to the office!';
    const expectedOutput = [0, 0, 2, 4, 5, 6, 7, 1, 3, 8];
    const preprocessor = new Preprocessor();
    preprocessor.language = language;
    preprocessor.maxSeqLen = maxSeqLen;
    preprocessor.vocabulary = vocabulary;
    expect(preprocessor.preprocess(sentence)).toEqual(expectedOutput);
  });
});
