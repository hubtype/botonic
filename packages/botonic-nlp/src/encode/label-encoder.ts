import { Vocabulary } from '../preprocess/vocabulary'

export class LabelEncoder {
  constructor(readonly vocabulary: Vocabulary) {}

  encode(sequence: string[]): number[] {
    return sequence.map(token => this.vocabulary.getTokenId(token))
  }

  decode(sequence: number[]): string[] {
    return sequence.map(id => this.vocabulary.getToken(id))
  }
}
