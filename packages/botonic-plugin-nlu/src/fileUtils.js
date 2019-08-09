import fs from 'fs'
import path from 'path'
import { shuffle } from './utils'
import { NLU_DATA_FILENAME, MODELS_DIRNAME } from './constants'

export function readDir(path) {
  return fs.readdirSync(path)
}

export function readFile(path, fileEncoding = 'utf-8') {
  return fs.readFileSync(path, fileEncoding)
}

export function readJSON(path) {
  return JSON.parse(readFile(path))
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
