import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import { NLU_DATA_FILENAME, MODELS_DIRNAME } from './constants'
function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
}

export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

function shuffle(obj1, obj2) {
  // shuffle two related arrays preserving indexes
  var index = obj1.length
  var rnd, tmp1, tmp2

  while (index) {
    rnd = Math.floor(Math.random() * index)
    index -= 1
    tmp1 = obj1[index]
    tmp2 = obj2[index]
    obj1[index] = obj1[rnd]
    obj2[index] = obj2[rnd]
    obj1[rnd] = tmp1
    obj2[rnd] = tmp2
  }
}

export function clone(src) {
  return Object.assign([], src)
}

export function readDir(dirPath) {
  return fs.readdirSync(dirPath)
}

export function readFile(filePath, fileEncoding = 'utf-8') {
  return fs.readFileSync(filePath, fileEncoding)
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

export function loadIntentsData({
  intentsPath,
  fileEncoding = 'utf-8',
  shuffleData = true
}) {
  let samples = []
  let labels = []
  let intentsDict = {}
  let intentsFiles = readDir(intentsPath)
  for (let i = 0, len = intentsFiles.length; i < len; i++) {
    intentsDict[i] = getIntentName(intentsFiles[i])
    let file = readFile(path.join(intentsPath, intentsFiles[i])).split('\n')
    for (let l = 0, len = file.length; l < len; l++) {
      samples.push(file[l])
      labels.push(i)
    }
  }
  if (shuffleData) {
    shuffle(samples, labels)
  }
  return { samples, labels, intentsDict }
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
  if (!fs.existsSync(modelsPath)) {
    mkdirp(modelsPath)
  }
  let resultsPath = path.join(modelsPath, `${lang}`)
  mkdirp(resultsPath)
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

export function printPrettyConfig(config) {
  console.log('\n\n*******************************************')
  console.log(`\n\nTRAINING MODEL FOR ${config.LANG}`)
  console.log('\nRUNNING WITH CONFIGURATION:')
  let max = 0
  for (let key in config) {
    if (key.length > max) {
      max = key.length
    }
  }
  for (let key in config) {
    let param = key + Array(max + 1 - key.length).join(' ')
    console.log(`   ${param} = ${config[key]}`)
  }
  console.log('\n')
  console.log('*******************************************')
}
