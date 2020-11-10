import { lstatSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'

import { DataSet } from './types'

export interface DataSetReaderConfig {
  csvSeparator?: string // ';' is the default separator
}

export class DatasetReader {
  static readData(path: string, config: DataSetReaderConfig): DataSet {
    if (lstatSync(path).isFile()) {
      return this.readFile(path, config)
    } else if (lstatSync(path).isDirectory()) {
      return this.getDataFromDirectory(path)
    } else {
      throw new Error(`Path must be a directory or a file. Path: "${path}".`)
    }
  }

  private static readFile(path: string, config: DataSetReaderConfig): DataSet {
    const extension = this.getExtension(path)
    switch (extension) {
      case 'csv':
        return this.readCSV(path, config?.csvSeparator)
      default:
        throw new Error(`Unable to read ${extension} files.`)
    }
  }

  private static getExtension(path: string): string {
    return path.split('.').pop()
  }

  static readCSV(path: string, separator = ';'): DataSet {
    const content = readFileSync(path, 'utf-8')
    const lines = content.split('\n')
    const columns = lines[0].split(separator)

    const data = lines.slice(1).map((line, lineNum) => {
      const values = line.split(separator)

      if (values.length != columns.length) {
        throw Error(
          `Invalid number of columns at line: ${lineNum + 2} (Expected: ${
            columns.length
          }, Recieved: ${values.length}).`
        )
      } else {
        const lineData = {}
        columns.forEach((column, i) => {
          lineData[column] = values[i]
        })
        return lineData
      }
    }) as DataSet
    return data
  }

  static getDataFromDirectory(path: string): DataSet {
    const data: DataSet = []

    const files = readdirSync(path).filter(
      fileName => this.getExtension(fileName) == 'txt'
    )

    if (files.length == 0) {
      throw new Error(
        `Directory must contain a txt file for each intent. Path: "${path}".`
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
