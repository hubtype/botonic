import fs from 'fs'
import path from 'path'
import colors from 'colors'
import { shuffle } from './utils'
import {
  NLU_DATA_FILENAME,
  MODELS_DIRNAME,
  NLU_CONFIG_FILENAME,
  ENTITIES_REGEX
} from './constants'

const FILE_OPEN_EXCEPTION = error => colors.red(`${error}`)
const CONFIG_NOT_FOUND_EXCEPTION = flagLang =>
  colors.red(
    `No configuration found for '${flagLang}' in ${NLU_CONFIG_FILENAME}.`
  )

export function readDir(dirPath) {
  try {
    return fs.readdirSync(dirPath).filter(dirName => dirName !== '.DS_Store')
  } catch (e) {
    throw FILE_OPEN_EXCEPTION(e)
  }
}

export function readFile(filePath, fileEncoding = 'utf-8') {
  try {
    return fs.readFileSync(filePath, fileEncoding)
  } catch (e) {
    throw FILE_OPEN_EXCEPTION(e)
  }
}

export function readJSON(jsonPath) {
  return JSON.parse(readFile(jsonPath))
}
export function writeJSON(jsonPath, object) {
  fs.writeFile(jsonPath, JSON.stringify(object, null, 2))
}

export function createDir(path) {
  fs.mkdirSync(path)
}

export function pathExists(path) {
  return fs.existsSync(path)
}

export function appendNewLine(path, str) {
  fs.appendFileSync(path, `\n${str}`)
}

export function readNLUConfig(nluConfigPath, flagLang) {
  let options = flagLang
    ? readJSON(path.join(nluConfigPath)).filter(
        config => config.LANG == flagLang
      )
    : readJSON(nluConfigPath)
  if (!(Array.isArray(options) && options.length)) {
    throw CONFIG_NOT_FOUND_EXCEPTION(flagLang)
  }
  return options
}

export async function saveResults({
  nluPath,
  maxSeqLength,
  vocabulary,
  intentsDict,
  model,
  lang,
  devEntities
}) {
  let modelsPath = path.join(nluPath, MODELS_DIRNAME)
  let resultsPath = path.join(modelsPath, `${lang}`)
  if (!pathExists(modelsPath)) {
    createDir(modelsPath)
  }
  if (!pathExists(resultsPath)) {
    createDir(resultsPath)
  }
  console.log('Saving intents and entities...')
  console.log('Saving word index...')
  let nluData = {
    maxSeqLength,
    vocabulary,
    intentsDict,
    lang,
    devEntities
  }
  console.log('Saving model...')
  await model.save(`file://${resultsPath}`)
  fs.writeFile(
    `${resultsPath}/${NLU_DATA_FILENAME}`,
    JSON.stringify(nluData, null, 2)
  )
}

export function getIntentName(fileName) {
  try {
    return fileName.match(/(.*).txt/)[1]
  } catch (e) {
    console.log(
      `${fileName} is not a valid. File must be of type IntentName.txt`
    )
  }
}

export function parseUtterance(utterance) {
  let capturedGroup = utterance.match(new RegExp(ENTITIES_REGEX, 'g')) || []
  let parsedEntities = capturedGroup
    .map(matched => ENTITIES_REGEX.exec(matched))
    .map(parsedEntity => ({
      raw: parsedEntity[0],
      value: parsedEntity[1],
      type: parsedEntity[2]
    }))
  for (let entity of parsedEntities) {
    utterance = utterance.replace(entity.raw, entity.value)
  }
  return { parsedUtterance: utterance, parsedEntities }
}

export function loadDevData(utterancesPath) {
  let samples = []
  let labels = []
  let intentsDict = {}
  let words = {}
  let tags = {}
  let tagList = []
  let devEntities = {}
  let utterancesFiles = readDir(utterancesPath)
  for (let [idx, file] of utterancesFiles.entries()) {
    intentsDict[idx] = getIntentName(file)
    let utterances = readFile(path.join(utterancesPath, file)).split('\n')
    for (let utterance of utterances) {
      let { parsedUtterance, parsedEntities } = parseUtterance(utterance)
      for (let entity of parsedEntities) {
        let { type, value } = entity
        words[`${value}`] = type
        tags[`${type}`] = { isA: type }
        if (!tagList.includes(type)) {
          tagList.push(type)
        }
      }
      samples.push(parsedUtterance)
      labels.push(idx)
    }
  }
  devEntities.words = words
  devEntities.tags = tags
  devEntities.tagList = tagList
  shuffle(samples, labels)
  return { samples, labels, intentsDict, devEntities }
}
