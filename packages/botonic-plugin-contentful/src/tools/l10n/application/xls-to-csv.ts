import * as fs from 'fs'
import { join } from 'path'
import * as XLSX from 'xlsx'

import { fixLocale } from '../../../nlp'

if (process.argv.length < 3 || process.argv[2] == '--help') {
  console.error(`Usage: xlsName locale [targetPath]`)
  // eslint-disable-next-line no-process-exit
  process.exit(1)
}

const xslName = process.argv[2]
const locale = process.argv[3]
const csvPath = process.argv.length > 4 ? process.argv[4] : '.'

function getCsvName(csvPath: string): string {
  if (csvPath.endsWith('.csv')) {
    return csvPath
  }
  return join(csvPath, `contentful_${fixLocale(locale)}.csv`)
}

function main(): string {
  const csvName = getCsvName(csvPath)
  const workBook = XLSX.readFile(xslName)
  const sheetName = workBook.SheetNames[0]
  const sheet = workBook.Sheets[sheetName]
  const stream = XLSX.stream.to_csv(sheet, { FS: ';' })
  stream.pipe(fs.createWriteStream(csvName))
  console.log(`CSV written to ${csvName}`)
  return csvName
}

void main()
