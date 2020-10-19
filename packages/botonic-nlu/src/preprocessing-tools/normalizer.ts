import { Normalizer } from '../types';

export class DefaultNormalizer implements Normalizer {
  normalize(sentence: string): string {
    return sentence.trim().toLowerCase();
  }
}
