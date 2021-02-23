/* eslint-disable @typescript-eslint/naming-convention */
import { lstatSync, readdirSync, readFileSync } from 'fs'
import * as yaml from 'js-yaml'
import { join } from 'path'

import { DataAugmenter } from './data-augmenter'
import { EntitiesParser } from './entities-parser'
import { ParsedData, Sample } from './types'

export class Parser {
  private static CLASS_FIELD = 'class'
  private static ENTITIES_FIELD = 'entities'
  private static DATA_AUGMENTATION_FIELD = 'data-augmentation'
  private static SAMPLES_FIELD = 'samples'

  static parse(path: string): ParsedData {
    const stat = lstatSync(path)
    if (stat.isFile()) {
      return Parser.parseFile(path)
    } else if (stat.isDirectory()) {
      return Parser.parseDirectory(path)
    } else {
      throw new Error(`path "${path}" must be a directory or a file.`)
    }
  }

  private static parseDirectory(path: string): ParsedData {
    let classes: string[] = []
    let entities: string[] = []
    let samples: Sample[] = []

    const files = readdirSync(path)
    files.forEach(filePath => {
      const parsedData = Parser.parseFile(join(path, filePath))
      classes = classes.concat(parsedData.classes)
      entities = entities.concat(parsedData.entities)
      samples = samples.concat(parsedData.samples)
    })

    return {
      classes: Array.from(new Set(classes)),
      entities: Array.from(new Set(entities)),
      samples: Array.from(new Set(samples)),
    }
  }

  private static parseFile(path: string): ParsedData {
    const content = yaml.load(readFileSync(path))

    const hasClass = Parser.CLASS_FIELD in content
    const hasEntities = Parser.ENTITIES_FIELD in content
    const hasDataAugmentation = Parser.DATA_AUGMENTATION_FIELD in content
    const hasSamples = Parser.SAMPLES_FIELD in content

    const className = hasClass ? content[Parser.CLASS_FIELD] : ''
    const entities = hasEntities ? content[Parser.ENTITIES_FIELD] : []

    let tmpSamples: string[] = content[Parser.SAMPLES_FIELD]

    if (hasDataAugmentation && hasSamples) {
      const augmenter = content[Parser.DATA_AUGMENTATION_FIELD]
      tmpSamples = DataAugmenter.augment(tmpSamples, augmenter, entities)
    }

    let samples: Sample[] = tmpSamples.map(sample => {
      return { text: sample, entities: [], class: className } as Sample
    })

    if (hasEntities) {
      samples = EntitiesParser.parse(samples, entities)
    }
    return {
      classes: className == '' ? [] : [className],
      entities: entities,
      samples: samples,
    }
  }
}
