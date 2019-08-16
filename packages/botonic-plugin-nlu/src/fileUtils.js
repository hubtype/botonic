import fs from 'fs'
import path from 'path'
import colors from 'colors'
import { shuffle } from './utils'
import {
  NLU_DATA_FILENAME,
  MODELS_DIRNAME,
  NLU_CONFIG_FILENAME
} from './constants'

const FILE_OPEN_EXCEPTION = path => colors.red(`'${path}' cannot be opened.`)
const CONFIG_NOT_FOUND_EXCEPTION = flagLang =>
  colors.red(
    `No configuration found for '${flagLang}' in ${NLU_CONFIG_FILENAME}.`
  )

export function readDir(dirPath) {
  try {
    return fs.readdirSync(dirPath)
  } catch (e) {
    throw FILE_OPEN_EXCEPTION(dirPath)
  }
}

export function readFile(filePath, fileEncoding = 'utf-8') {
  try {
    return fs.readFileSync(filePath, fileEncoding)
  } catch (e) {
    throw FILE_OPEN_EXCEPTION(filePath)
  }
}

export function readJSON(jsonPath) {
  return JSON.parse(readFile(jsonPath))
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
  lang
}) {
  let modelsPath = path.join(nluPath, MODELS_DIRNAME)
  let resultsPath = path.join(modelsPath, `${lang}`)
  if (!pathExists(modelsPath)) {
    createDir(modelsPath)
  }
  if (!pathExists(resultsPath)) {
    createDir(resultsPath)
  }
  console.log('Saving intents...')
  console.log('Saving word index...')
  let nluData = {
    maxSeqLength,
    vocabulary,
    intentsDict,
    lang
  }
  console.log('Saving model...')
  await model.save(`file://${resultsPath}`)
  fs.writeFile(
    `${resultsPath}/${NLU_DATA_FILENAME}`,
    JSON.stringify(nluData, null, 2)
  )
}

function getIntentName(fileName) {
  try {
    return fileName.match(/(.*).txt/)[1]
  } catch (e) {
    console.log(
      `${fileName} is not a valid. File must be of type IntentName.txt`
    )
  }
}

export function loadIntentsData(intentsPath) {
  let samples = []
  let labels = []
  let intentsDict = {}
  let intentsFiles = readDir(intentsPath)
  for (let [idx, file] of intentsFiles.entries()) {
    intentsDict[idx] = getIntentName(file)
    let sentences = readFile(path.join(intentsPath, file)).split('\n')
    for (let sentence of sentences) {
      samples.push(sentence)
      labels.push(idx)
    }
  }
  shuffle(samples, labels)
  return { samples, labels, intentsDict }
}
