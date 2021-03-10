import { Sample } from '../dataset/types'
import { PADDING_TOKEN } from './constants'
import { Preprocessor } from './preprocessor'

export class VocabularyGenerator {
  private constructor(private preprocessor: Preprocessor) {}

  static using(preprocessor: Preprocessor): VocabularyGenerator {
    return new VocabularyGenerator(preprocessor)
  }

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
    return Array.from(new Set(vocabulary))
  }
}
