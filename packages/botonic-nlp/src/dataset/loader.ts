/* eslint-disable @typescript-eslint/naming-convention */
import { lstatSync, readdirSync, readFileSync } from 'fs'
import { load as loadYaml } from 'js-yaml'
import { extname, join } from 'path'

import { unique } from '../utils/array-utils'
import { DataAugmenter } from './data-augmenter'
import { EntitiesParser } from './entities-parser'
import { DatasetInfo, Sample } from './types'

const YAML_EXTENSION = '.yaml'
const YML_EXTENSION = '.yml'

export class DatasetLoader {
  private static ALLOWED_FILE_EXTENSIONS = [YAML_EXTENSION, YML_EXTENSION]
  private static CLASS_FIELD = 'class'
  private static ENTITIES_FIELD = 'entities'
  private static DATA_AUGMENTATION_FIELD = 'data-augmentation'
  private static SAMPLES_FIELD = 'samples'

  static load(path: string): DatasetInfo {
    const stat = lstatSync(path)

    if (stat.isFile()) {
      return this.loadFile(path)
    }

    if (stat.isDirectory()) {
      return this.loadDirectory(path)
    }

    throw new Error(`path "${path}" must be a directory or file.`)
  }

  private static loadDirectory(path: string): DatasetInfo {
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
      classes: unique(classes),
      entities: unique(entities),
      samples: unique(samples),
    }
  }

  private static loadFile(path: string): DatasetInfo {
    if (!this.ALLOWED_FILE_EXTENSIONS.includes(extname(path))) {
      throw new Error(
        `File '${path}' must be a ${this.ALLOWED_FILE_EXTENSIONS.join(',')}.`
      )
    }

    const content = loadYaml(readFileSync(path))

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
