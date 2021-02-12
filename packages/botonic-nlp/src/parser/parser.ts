import * as fs from 'fs'
import * as yaml from 'js-yaml'

import { NEUTRAL_ENTITY } from './constants'
import { DataAugmenter } from './data-augmenter'
import { EntitiesParser } from './entities-parser'
import { ParsedData, Sample } from './types'

export class Parser {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static CLASS_FIELD = 'class'
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static ENTITIES_FIELD = 'entities'
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static DATA_AUGMENTATION_FIELD = 'data-augmentation'
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static SAMPLES_FIELD = 'samples'

  static parse(path: string): ParsedData {
    const content = yaml.load(fs.readFileSync(path))

    const hasClass = Parser.CLASS_FIELD in content
    const hasEntities = Parser.ENTITIES_FIELD in content
    const hasDataAugmentation = Parser.DATA_AUGMENTATION_FIELD in content
    const hasSamples = Parser.SAMPLES_FIELD in content

    const className = hasClass ? content[Parser.CLASS_FIELD] : ''
    const entities = hasEntities
      ? [NEUTRAL_ENTITY].concat(content[Parser.ENTITIES_FIELD])
      : [NEUTRAL_ENTITY]

    let tmpSamples: string[] = content[Parser.SAMPLES_FIELD]

    if (hasDataAugmentation && hasSamples) {
      const augmenter = content[Parser.DATA_AUGMENTATION_FIELD]
      tmpSamples = DataAugmenter.augment(tmpSamples, augmenter, entities)
    }

    let samples: Sample[] = tmpSamples.map(sample => {
      return { text: sample, entities: [] } as Sample
    })

    if (hasEntities) {
      samples = EntitiesParser.parse(samples, entities)
    }
    return { class: className, entities: entities, samples: samples }
  }
}
