import { csvParse } from 'd3'
import { lstatSync, readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { DataSet } from './types'

export class DataReader {
  readData(path: string): DataSet {
    if (lstatSync(path).isFile()) {
      return this.readFile(path)
    } else if (lstatSync(path).isDirectory()) {
      return this.getDataFromDirectory(path)
    } else {
      throw Error('Path must be a directory or a file. Path:"' + path + '".')
    }
  }

  private readFile(path: string): DataSet {
    const extension = this.getExtension(path)
    switch (extension) {
      case 'csv':
        return this.readCSV(path)
      default:
        throw Error(`File must be a csv. Path: "${path}".`)
    }
  }

  private getExtension(path: string): string {
    return path.split('.').pop()
  }

  private readCSV(path: string): DataSet {
    const text = readFileSync(path, 'utf-8')
    const info = csvParse(text)
    return info.map(sample => {
      return { label: sample.label, feature: sample.feature }
    })
  }

  private getDataFromDirectory(path: string): DataSet {
    const data: DataSet = []

    const files = readdirSync(path).filter(
      fileName => this.getExtension(fileName) == 'txt'
    )

    if (files.length == 0) {
      throw Error(
        'Directory must contain a txt file for each intent. Path:"' +
          path +
          '".'
      )
    }

    files.forEach(fileName => {
      const intentName = fileName.split('.').shift()
      const filePath = join(path, fileName)
      const fileText = readFileSync(filePath, 'utf-8')
      const lines = fileText.split('\n')
      lines.forEach(line => {
        data.push({ label: intentName, feature: line })
      })
    })

    return data
  }
}
