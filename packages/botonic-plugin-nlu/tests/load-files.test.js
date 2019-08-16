import { readNLUConfig, loadIntentsData, readDir } from '../src/fileUtils'
import path from 'path'
import {
  NLU_DIRNAME,
  NLU_CONFIG_FILENAME,
  WORD_EMBEDDINGS_PATH,
  INTENTS_DIRNAME
} from '../src/constants'

const developerPath = path.join(
  process.env.INIT_CWD,
  'tests',
  'bot-directory',
  'src'
)
const nluPath = path.join(developerPath, NLU_DIRNAME)
const intentsPath = path.join(nluPath, INTENTS_DIRNAME)

describe('Loading Dev NLU Config', () => {
  it('should return a non-empty array of options', () => {
    let flagLang = 'eng' // null || undefined
    let nluConfigPath = path.join(nluPath, NLU_CONFIG_FILENAME)
    let options = readNLUConfig(nluConfigPath, flagLang)
    expect(Array.isArray(options) && options.length).toBeTruthy()
  })
})

describe('Loading intents data for a given config', () => {
  let lang = 'eng'
  let intentsFiles = readDir(path.join(intentsPath, lang))
  let data = loadIntentsData(path.join(intentsPath, lang))
  it('should return an object of type {samples, labels, intentsDict}', () => {
    expect(data).toEqual(
      expect.objectContaining({
        samples: expect.any(Array),
        labels: expect.any(Array),
        intentsDict: expect.any(Object)
      })
    )
  })
  it(`intentsDict has the same length as the number of intents in ${path.join(
    intentsPath,
    lang
  )}`, () => {
    expect(Object.entries(data.intentsDict)).toHaveLength(intentsFiles.length)
  })
  it(`samples and labels to have equal length`, () => {
    expect(data.samples.length == data.labels.length).toBeTruthy()
  })
})
