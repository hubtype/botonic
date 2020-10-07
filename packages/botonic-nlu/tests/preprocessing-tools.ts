import { Language } from '../src/types';

export const normalizer = {
  normalize: (sentence: string): string => sentence.toLowerCase(),
};

export const stemmer = {
  stem: (sentence: string, language: Language): string => {
    return sentence;
  },
};

export const tokenizer = {
  tokenize: (sentence: string): string[] => sentence.split(' '),
};
