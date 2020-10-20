import { DefaultNormalizer } from '../src/preprocessing-tools/normalizer';
import { DefaultStemmer } from '../src/preprocessing-tools/stemmer';
import { DefaultTokenizer } from '../src/preprocessing-tools/tokenizer';
import { Preprocessor } from '../src/preprocessor';

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
  const preprocessor = Preprocessor.fromData(
    [
      { label: 'Greetings', feature: 'Hi!' },
      { label: 'BookRestaurant', feature: 'I want to book a table' },
      {
        label: 'BuyClothes',
        feature: 'I would like to buy these trousers',
      },
    ],
    'en',
    10,
    {
      normalizer: new DefaultNormalizer(),
      tokenizer: new DefaultTokenizer(),
      stemmer: new DefaultStemmer(),
    },
  );

  test('Generating vocabulary from data', () => {
    expect(preprocessor.vocabulary).toEqual({
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
    expect(preprocessor.preprocess('I want to book a big table.')).toEqual([
      0,
      0,
      3,
      4,
      5,
      6,
      7,
      0,
      8,
      0,
    ]);
  });
});
