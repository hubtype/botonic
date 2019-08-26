import {
  readNLUConfig,
  loadDevData,
  readDir,
  readFile,
  parseUtterance,
  readJSON
} from '../src/file-utils'

import { shuffle, parseLangFlag } from '../src/utils'
import path from 'path'
import {
  NLU_DIRNAME,
  NLU_CONFIG_FILENAME,
  WORD_EMBEDDINGS_PATH,
  UTTERANCES_DIRNAME
} from '../src/constants'

import { BotonicNLU } from '../src/botonic-nlu'

const developerPath = process.cwd(
  process.chdir(path.join(process.cwd(), '..', 'src'))
)
// const nluPath = path.join(developerPath, NLU_DIRNAME)
// const intentsPath = path.join(nluPath, UTTERANCES_DIRNAME)

describe('Initializing BotonicNLU languages', () => {
  let nluPath = '/Users/marcrabat/Desktop/nlu/'
  let languages = ['eng', 'spa']
  it('Should load all languages when only nluPath', () => {
    let botonicNLU = new BotonicNLU({
      nluPath
    })
    expect(botonicNLU.languages).toStrictEqual(languages)
    expect(Object.keys(botonicNLU.devData)).toStrictEqual(languages)
  })
  it('Should load all languages when only nluPath (set manually)', () => {
    let botonicNLU = new BotonicNLU({
      nluPath,
      languages: ['eng', 'spa']
    })
    expect(botonicNLU.languages).toStrictEqual(languages)
    expect(Object.keys(botonicNLU.devData)).toStrictEqual(languages)
  })
  let language = ['eng']
  it('Should specific language with flag', () => {
    process.argv.push('--lang')
    process.argv.push('eng')
    let botonicNLU = new BotonicNLU({
      nluPath
    })
    expect(botonicNLU.languages).toStrictEqual(language)
    expect(Object.keys(botonicNLU.devData)).toStrictEqual(language)
  })
  it('Should specific language with specified language (set manually)', () => {
    let botonicNLU = new BotonicNLU({
      nluPath,
      languages: ['eng']
    })
    expect(botonicNLU.languages).toStrictEqual(language)
    expect(Object.keys(botonicNLU.devData)).toStrictEqual(language)
  })
})

// describe('Loading Dev NLU Config', () => {
//   it('should return a non-empty array of options', () => {
//     let flagLang = 'eng' // null || undefined
//     let nluConfigPath = path.join(nluPath, NLU_CONFIG_FILENAME)
//     let options = readNLUConfig(nluConfigPath, flagLang)
//     expect(Array.isArray(options) && options.length).toBeTruthy()
//   })
// })

// describe('Loading dev data for a given config', () => {
//   let lang = 'eng'
//   let intentsFiles = readDir(path.join(intentsPath, lang))
//   let data = loadDevData(path.join(intentsPath, lang))
//   it('should return an object of type {samples, labels, intentsDict, entities}', () => {
//     expect(data).toEqual(
//       expect.objectContaining({
//         samples: expect.any(Array),
//         labels: expect.any(Array),
//         intentsDict: expect.any(Object),
//         devEntities: expect.any(Object)
//       })
//     )
//   })
//   it(`intentsDict has the same length as the number of intents in ${path.join(
//     intentsPath,
//     lang
//   )}`, () => {
//     expect(Object.entries(data.intentsDict)).toHaveLength(intentsFiles.length)
//   })
//   it(`samples and labels to have equal length`, () => {
//     expect(data.samples.length == data.labels.length).toBeTruthy()
//   })
// })

// describe('Parsing entities', () => {
//   it('should return the parsed entities', () => {
//     let entityValue = 'Seven Hills'
//     let entityType = 'place'
//     let rawEntity = `[${entityValue}](${entityType})`
//     let utterance = `Book a table at ${rawEntity} for 6 people with a nice view`
//     let { parsedEntities } = parseUtterance(utterance)
//     expect(parsedEntities.length).toBeTruthy()
//     expect(parsedEntities[0]).toEqual(
//       expect.objectContaining({
//         raw: rawEntity,
//         value: entityValue,
//         type: entityType
//       })
//     )
//   })
//   it('should return an empty list when there are no entities', () => {
//     let utterance =
//       "I'd like a table in a peaceful restaurant around Times Square"
//     let { parsedEntities } = parseUtterance(utterance)
//     expect(parsedEntities.length).toBeFalsy()
//   })
// })

// describe('Using compromise', () => {
//   // it('given an utterance returns the entity', () => {
//   //   let langs = ['eng', 'spa']
//   //   let entities = {}
//   //   let tagList = []
//   //   let words = {}
//   //   let tags = {}
//   //   for (let lang of langs) {
//   //     let { devEntities } = loadDevData(path.join(intentsPath, lang))
//   //     words = Object.assign(words, devEntities.words)
//   //     tags = Object.assign(tags, devEntities.tags)
//   //     tagList = tagList.concat(devEntities.tagList)
//   //   }
//   //   nlp.plugin(compromisePlugin.pack(devEntities))
//   //   let utterance = 'Book a table at barcelona for Barack Obama in Google'
//   //   let doc = nlp(utterance)
//   // })
//   // it('should load entities data', () => {
//   //   let nluData = readJSON(path.join(nluPath, 'models', 'spa', 'nlu-data.json'))
//   //   console.log('LOADED ENTITIES: ', nluData.entities)
//   //   nlp.plugin(compromisePlugin.pack(nluData.entities))
//   //   let utterance = 'Buenas tardes'
//   //   let doc = nlp(utterance)
//   //   console.log(doc.out('tags'))
//   // })
// })
