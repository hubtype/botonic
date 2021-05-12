import { lstatSync, readdirSync, readFileSync } from 'fs'
import { load as loadYaml } from 'js-yaml'
import { extname, join } from 'path'

import { unique } from '../utils/array-utils'
import { AugmenterMap, DataAugmenter } from './data-augmenter'
import { DefinedEntity, EntitiesParser } from './entities-parser'

type InputData = {
  class?: string
  entities?: string[]
  'data-augmentation'?: AugmenterMap
  samples: string[]
}

export type Sample = { text: string; class: string; entities: DefinedEntity[] }

export type ParsedData = {
  classes: string[]
  entities: string[]
  samples: Sample[]
}

export class InputParser {
  public readonly ALLOWED_EXTENSIONS = ['.yaml', '.yml']

  constructor(private path: string) {}

  parse(): ParsedData {
    const files = this.getInputFiles()

    const classes: Set<string> = new Set()
    const entities: Set<string> = new Set()
    const samples: Set<Sample> = new Set()

    files.forEach(filePath => {
      const parsedData = this.parseInputFile(filePath)
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

  private getInputFiles(): string[] {
    const stat = lstatSync(this.path)

    if (!stat.isDirectory()) {
      throw new Error(`path '${this.path}' must be a directory.`)
    }

    return readdirSync(this.path)
      .filter(fileName => this.ALLOWED_EXTENSIONS.includes(extname(fileName)))
      .map(fileName => join(this.path, fileName))
  }

  private parseInputFile(path: string): ParsedData {
    const inputData: InputData = loadYaml(readFileSync(path))
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
