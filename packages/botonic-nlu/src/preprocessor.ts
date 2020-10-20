/* eslint-disable @typescript-eslint/unbound-method */
import { UNKNOWN_TOKEN } from './constants';
import {
  DataSet,
  Vocabulary,
  Normalizer,
  Stemmer,
  Tokenizer,
  PreprocessorEngines,
} from './types';
import { Language } from './language';
import { readJSON } from './util/file-system';

export class Preprocessor {
  protected constructor(
    readonly language: Language,
    readonly maxSeqLen: number,
    readonly vocabulary: Vocabulary,
    readonly normalizer: Normalizer,
    readonly tokenizer: Tokenizer,
    readonly stemmer: Stemmer,
  ) {}

  static fromModelData(
    path: string,
    engines: PreprocessorEngines,
  ): Preprocessor {
    const modelData = readJSON(path);
    return new Preprocessor(
      modelData.language,
      modelData.maxSeqLen,
      modelData.vocabulary,
      engines.normalizer,
      engines.tokenizer,
      engines.stemmer,
    );
  }

  static fromData(
    data: DataSet,
    language: Language,
    maxSeqLen: number,
    engines: PreprocessorEngines,
  ): Preprocessor {
    let id = 0;
    const vocabulary = {};
    vocabulary[UNKNOWN_TOKEN] = id;
    id++;
    data.forEach((sample) => {
      const normalizedSentence = engines.normalizer.normalize(sample.feature);
      const tokens = engines.tokenizer.tokenize(normalizedSentence);
      const stemmedTokens = tokens.map((token) =>
        engines.stemmer.stem(token, language),
      );
      stemmedTokens.forEach((token) => {
        if (!(token in vocabulary)) {
          vocabulary[token] = id;
          id++;
        }
      });
    });

    return new Preprocessor(
      language,
      maxSeqLen,
      vocabulary,
      engines.normalizer,
      engines.tokenizer,
      engines.stemmer,
    );
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
