/* eslint-disable @typescript-eslint/naming-convention */
import { lstatSync, readdirSync, readFileSync } from 'fs'
import * as yaml from 'js-yaml'
import { join } from 'path'

import { DataAugmenter } from './data-augmenter'
import { EntitiesParser } from './entities-parser'
import { Data, Sample } from './types'

export class Parser {
  private static CLASS_FIELD = 'class'
  private static ENTITIES_FIELD = 'entities'
  private static DATA_AUGMENTATION_FIELD = 'data-augmentation'
  private static SAMPLES_FIELD = 'samples'

  static parse(path: string): Data {
    const stat = lstatSync(path)

    if (stat.isFile()) {
      return Parser.parseFile(path)
    }

    if (stat.isDirectory()) {
      return Parser.parseDirectory(path)
    }

    throw new Error(`path "${path}" must be a directory or file.`)
  }

  private static parseDirectory(path: string): Data {
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

  private static parseFile(path: string): Data {
    const content = yaml.load(readFileSync(path))

    if (this.SAMPLES_FIELD in content) {
      const className =
        this.CLASS_FIELD in content ? content[this.CLASS_FIELD] : ''

      const entities =
        this.ENTITIES_FIELD in content ? content[this.ENTITIES_FIELD] : []

      let sentences = content[this.SAMPLES_FIELD]

      if (this.DATA_AUGMENTATION_FIELD in content) {
        const augmenter = new DataAugmenter(
          content[this.DATA_AUGMENTATION_FIELD],
          entities
        )
        sentences = augmenter.augment(sentences)
      }

      let samples: Sample[] = sentences.map(s => {
        return { text: s, class: className, entities: [] }
      })

      if (this.ENTITIES_FIELD in content) {
        samples = EntitiesParser.parse(samples, entities)
      }

      return {
        classes: this.CLASS_FIELD in content ? [className] : [],
        entities,
        samples,
      }
    } else {
      throw new Error('File must contain "samples" field')
    }
  }
}
