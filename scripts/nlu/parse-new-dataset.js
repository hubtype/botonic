const { readdirSync, readFileSync, writeFileSync } = require('fs')
const { join } = require('path')

function readJSONFile(path) {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

const dirPath = ''
const files = readdirSync(dirPath)
  .filter(fileName => fileName.split('.').pop() == 'json')
  .map(fileName => join(dirPath, fileName))
const SEPARATOR = ','
const dataset = {}

files.forEach(filePath => {
  const intent = filePath.split('/').pop().split('.').shift()
  dataset[intent] = []
  const set = readJSONFile(filePath)[intent]
  set.forEach(data => {
    const sentence = data.data
      .map(info => info.text)
      .join('')
      .replace(/[,\n]/g, '')
    dataset[intent].push(sentence)
  })
})

var csvData = 'feature' + SEPARATOR + 'label' + '\n'

Object.keys(dataset).forEach(intent => {
  const txtPath = join(dirPath, intent + '.txt')
  var txtData = ''
  dataset[intent].forEach(sentence => {
    csvData += sentence + SEPARATOR + intent + '\n'
    txtData += sentence + '\n'
  })
  writeFileSync(txtPath, txtData)
})

const csvPath = join(dirPath, 'data.csv')
writeFileSync(csvPath, csvData)
