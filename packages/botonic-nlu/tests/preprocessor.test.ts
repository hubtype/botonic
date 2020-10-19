import { DefaultNormalizer } from '../src/preprocessing-tools/normalizer';
import { DefaultStemmer } from '../src/preprocessing-tools/stemmer';
import { DefaultTokenizer } from '../src/preprocessing-tools/tokenizer';
import { Preprocessor } from '../src/preprocessor';
import * as CONSTANTS from '../src/constants';

describe('Preprocessor Tools', () => {
  test('Normalizing a sentence', () => {
    expect(
      new DefaultNormalizer().normalize('Today I am going to the office!'),
    ).toEqual('today i am going to the office!');
  });

  test('Tokenizing a sentence', () => {
    expect(
      new DefaultTokenizer().tokenize('today i am going to the office!'),
    ).toEqual(['today', 'i', 'am', 'going', 'to', 'the', 'office', '!']);
  });

  test('Stemming a sentence', () => {
    const stemmer = new DefaultStemmer(true);
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
      expect(stemmer.stem(token, 'en')).toEqual(expectedOutputs[i]);
    });
  });
});

describe('Preprocessor', () => {
  test('Generating a vocabulary', () => {
    expect(
      new Preprocessor().generateVocabulary([
        { label: 'Greetings', feature: 'Hi!' },
        { label: 'BookRestaurant', feature: 'I want to book a table' },
        { label: 'BuyClothes', feature: 'I would like to buy these trousers' },
      ]),
    ).toEqual({
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
    });
  });

  test('Preprocessing a sentence', () => {
    const preprocessor = new Preprocessor();
    preprocessor.language = 'en';
    preprocessor.maxSeqLen = 10;
    preprocessor.vocabulary = {
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
    expect(preprocessor.preprocess('Today I am going to the office!')).toEqual([
      0,
      0,
      2,
      4,
      5,
      6,
      7,
      1,
      3,
      8,
    ]);
  });
});
