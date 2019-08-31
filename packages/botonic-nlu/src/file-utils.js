import fs from 'fs'
import path from 'path'
import axios from 'axios'
import colors from 'colors'
import { parseUtterance } from './preprocessing'
import { filterObjectByWhitelist } from './utils'
import {
  NLU_CONFIG_FILENAME,
  UTTERANCES_DIRNAME,
  MODELS_DIRNAME,
  NLU_DATA_FILENAME
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
  fs.writeFileSync(jsonPath, JSON.stringify(object, null, 2))
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

export function getIntentName(fileName) {
  try {
    return fileName.match(/(.*).txt/)[1]
  } catch (e) {
    console.log(
      `${fileName} is not a valid. File must be of type IntentName.txt`
    )
  }
}

export function loadDevData(nluPath, languages) {
  let nluConfig = readJSON(path.join(nluPath, NLU_CONFIG_FILENAME))
  let devData = languages
    ? filterObjectByWhitelist(nluConfig, languages)
    : nluConfig
  Object.entries(devData).forEach(([lang, config]) => {
    config.utterancesDir = path.join(nluPath, UTTERANCES_DIRNAME, lang)
    config.modelsPath = path.join(nluPath, MODELS_DIRNAME, lang)
    config.devIntents = { intentsDict: {}, intents: [] }
    config.devEntities = { words: {}, tags: {}, tagList: [] }
    let utterancesDir = config.utterancesDir
    let utterancesFiles = readDir(utterancesDir)
    for (let [idx, file] of utterancesFiles.entries()) {
      config.devIntents.intentsDict[idx] = getIntentName(file)
      let utterances = readFile(path.join(utterancesDir, file)).split('\n')
      for (let utterance of utterances) {
        let { parsedUtterance, parsedEntities } = parseUtterance(utterance)
        config.devIntents.intents.push({
          rawUtterance: utterance,
          utterance: parsedUtterance,
          label: idx
        })
        for (let entity of parsedEntities) {
          let { type, value } = entity
          config.devEntities.words[value] = type
          config.devEntities.tags[type] = { isA: type }
          if (!config.devEntities.tagList.includes(type)) {
            config.devEntities.tagList.push(type)
          }
        }
      }
    }
  })
  return devData
}

export async function saveDevData({ modelsPath, model, language, nluData }) {
  let resultsPath = path.join(modelsPath, language)
  if (!pathExists(modelsPath)) {
    createDir(modelsPath)
  }
  if (!pathExists(resultsPath)) {
    createDir(resultsPath)
  }
  console.log('Saving model...')
  await model.save(`file://${resultsPath}`)
  console.log('Saving intents and entities...')
  console.log('Saving word index...')
  writeJSON(`${resultsPath}/${NLU_DATA_FILENAME}`, nluData)
  console.log('\n')
}

export async function downloadFileToDisk({ url, downloadPath }) {
  try {
    const fileWriter = fs.createWriteStream(downloadPath)
    let downloadedFile = await axios.get(url, { responseType: 'stream' })
    downloadedFile.data.pipe(fileWriter)
    return new Promise((resolve, reject) => {
      fileWriter.on('finish', resolve)
      fileWriter.on('error', reject)
    })
  } catch (e) {
    console.log(colors.red(`Error downloading the file.`))
    console.log(colors.red(`${e.response.status}: ${e.response.statusText}`))
  }
}
