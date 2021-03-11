import { Sample } from '../dataset/types'
import { unique } from '../utils/array-utils'
import { PADDING_TOKEN } from './constants'
import { Preprocessor } from './preprocessor'

export class VocabularyGenerator {
  constructor(private preprocessor: Preprocessor) {}

  generate(samples: Sample[]): string[] {
    let vocabulary: string[] = []
    samples.forEach(s => {
      vocabulary = vocabulary.concat(
        this.preprocessor.pad(
          this.preprocessor.stem(
            this.preprocessor.removeStopwords(
              this.preprocessor.tokenize(this.preprocessor.normalize(s.text))
            )
          ),
          PADDING_TOKEN
        )
      )
    })
    vocabulary = vocabulary.filter(t => t != PADDING_TOKEN)
    return unique(vocabulary)
  }
}
