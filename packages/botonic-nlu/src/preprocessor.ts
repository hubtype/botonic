/* eslint-disable @typescript-eslint/unbound-method */
import { DefaultTokenizer } from './preprocessing-tools/tokenizer';
import { DefaultStemmer } from './preprocessing-tools/stemmer';
import { DefaultNormalizer } from './preprocessing-tools/normalizer';
import { UNKNOWN_TOKEN } from './constants';
import { DataSet, Vocabulary, Normalizer, Stemmer, Tokenizer } from './types';
import { Language } from './language';

export class Preprocessor {
  normalizer: Normalizer = new DefaultNormalizer();
  stemmer: Stemmer = new DefaultStemmer();
  tokenizer: Tokenizer = new DefaultTokenizer();
  language: Language;
  maxSeqLen: number;
  vocabulary: Vocabulary;

  // TODO: Maybe vocabulary should be generated with a different data set than the train or test one.
  generateVocabulary(data: DataSet): Vocabulary {
    this.vocabulary = {};
    this.vocabulary[UNKNOWN_TOKEN] = 0;
    let id = 1;
    data.forEach((sample) => {
      const normalizedSentence = this.normalizer.normalize(sample.feature);
      const tokens = this.tokenizer.tokenize(normalizedSentence);
      const stemmedTokens = tokens.map((token) =>
        this.stemmer.stem(token, this.language),
      );
      stemmedTokens.forEach((token) => {
        if (!(token in this.vocabulary)) {
          this.vocabulary[token] = id;
          id++;
        }
      });
    });
    return this.vocabulary;
  }

  preprocess(sentence: string): number[] {
    const normalizedSentence = this.normalizer.normalize(sentence);
    const tokens = this.tokenizer.tokenize(normalizedSentence);
    const stemmedTokens = tokens.map((token) =>
      this.stemmer.stem(token, this.language),
    );
    const sequence = this.computeSequence(stemmedTokens);
    return sequence;
  }

  private computeSequence(tokens: string[]): number[] {
    let sequence = tokens.map((token) =>
      token in this.vocabulary ? this.vocabulary[token] : 0,
    );
    sequence = sequence.slice(0, this.maxSeqLen);
    return Array(this.maxSeqLen - sequence.length)
      .fill(0)
      .concat(sequence);
  }
}
