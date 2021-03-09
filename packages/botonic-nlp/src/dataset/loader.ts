/* eslint-disable @typescript-eslint/naming-convention */
import { lstatSync, readdirSync, readFileSync } from 'fs'
import * as yaml from 'js-yaml'
import { extname, join } from 'path'

import { DataAugmenter } from './data-augmenter'
import { EntitiesParser } from './entities-parser'
import { Dataset, Sample } from './types'

export class DatasetLoader {
  private static CLASS_FIELD = 'class'
  private static ENTITIES_FIELD = 'entities'
  private static DATA_AUGMENTATION_FIELD = 'data-augmentation'
  private static SAMPLES_FIELD = 'samples'

  static load(path: string): Dataset {
    const stat = lstatSync(path)

    if (stat.isFile()) {
      return this.loadFile(path)
    }

    if (stat.isDirectory()) {
      return this.loadDirectory(path)
    }

    throw new Error(`path "${path}" must be a directory or file.`)
  }

  private static loadDirectory(path: string): Dataset {
    const files = readdirSync(path)
    const datasets = files.map(filePath => this.loadFile(join(path, filePath)))
    const classes = datasets.reduce(
      (classes, dataset) => classes.concat(dataset.classes),
      []
    )
    const entities = datasets.reduce(
      (entities, dataset) => entities.concat(dataset.entities),
      []
    )
    const samples = datasets.reduce(
      (samples, dataset) => samples.concat(dataset.samples),
      []
    )

    return {
      classes: Array.from(new Set(classes)),
      entities: Array.from(new Set(entities)),
      samples: Array.from(new Set(samples)),
    }
  }

  private static loadFile(path: string): Dataset {
    if (extname(path) != '.yaml') {
      throw new Error(`File '${path}' must be a yaml.`)
    }

    const content = yaml.load(readFileSync(path))

    if (!(this.SAMPLES_FIELD in content)) {
      throw new Error('File must contain "samples" field')
    }

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
  }
}
