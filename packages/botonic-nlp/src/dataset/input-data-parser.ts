import { AugmenterMap, DataAugmenter } from './data-augmenter'
import { DefinedEntity, EntitiesParser } from './entities-parser'
import { InputData } from './input-data-reader'

export type Sample = { text: string; class: string; entities: DefinedEntity[] }

export type ParsedData = {
  classes: string[]
  entities: string[]
  samples: Sample[]
}

export class InputDataParser {
  parse(inputData: InputData[]): ParsedData {
    const classes: Set<string> = new Set()
    const entities: Set<string> = new Set()
    const samples: Set<Sample> = new Set()

    inputData.forEach(data => {
      const parsedData = this.parseInputData(data)
      parsedData.classes.forEach(c => classes.add(c))
      parsedData.entities.forEach(e => entities.add(e))
      parsedData.samples.forEach(s => samples.add(s))
    })

    return {
      classes: Array.from(classes),
      entities: Array.from(entities),
      samples: Array.from(samples),
    }
  }

  private parseInputData(inputData: InputData): ParsedData {
    const className: string = inputData.class ?? ''
    const classes: string[] = inputData.class ? [inputData.class] : []
    const entities: string[] = inputData.entities ?? []
    const augmenterMap: AugmenterMap = inputData['data-augmentation'] ?? {}

    let sentences = inputData.samples

    if ('data-augmentation' in inputData) {
      const augmenter = new DataAugmenter(augmenterMap, entities)
      sentences = augmenter.augment(sentences)
    }

    let samples = sentences.map(text => {
      return { text, class: className, entities: [] }
    })

    if (entities.length !== 0) {
      const entitiesParser = new EntitiesParser(entities)
      samples = samples.map(sample => {
        const { text, entities } = entitiesParser.parse(sample.text)
        sample.text = text
        sample.entities = entities
        return sample
      })
    }

    return { classes, entities, samples }
  }
}
