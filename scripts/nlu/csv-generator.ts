import { readFileSync, writeFileSync, readdirSync, lstatSync } from 'fs'
import { join } from 'path'

export class CsvGenerator {
  SEPARATOR = ','

  generate(srcPath: string, dstPath: string) {
    const data = this.getData(srcPath)
    this.saveData(data, dstPath)
  }

  private getData(path: string): string {
    if (lstatSync(path).isFile()) {
      return this.getDataFromFile(path)
    } else if (lstatSync(path).isDirectory()) {
      return this.getDataFromDirectory(path)
    } else {
      throw Error('Path must be a directory or a file.')
    }
  }

  private getDataFromFile(path: string): string {
    const extension = path.split('.').pop()
    switch (extension) {
      default:
        throw Error('Csv generation from file is not implemented.')
    }
  }

  private getDataFromDirectory(path: string): string {
    let data = 'feature' + this.SEPARATOR + 'label'
    const files = readdirSync(path).filter(
      fileName => fileName.split('.').pop() == 'txt'
    )
    files.forEach(fileName => {
      const intent = fileName.split('.').shift()
      const content = readFileSync(join(path, fileName), 'utf-8').split('\n')
      content.forEach(sentence => {
        const normalizedSentence = sentence.replace(/[,"]/g, '')
        if (normalizedSentence != '') {
          const sample = '\n' + normalizedSentence + this.SEPARATOR + intent
          data += sample
        }
      })
    })
    return data
  }

  private saveData(data: string, path: string) {
    if (lstatSync(path).isDirectory()) {
      path = join(path, 'data.csv')
    } else if (lstatSync(path).isFile()) {
      const extension = path.split('.').pop()
      if (extension != 'csv') {
        throw Error('dstPath should be a directory or a csv file.')
      }
    } else {
      throw Error('dstPath must be a directory or a file.')
    }
    writeFileSync(path, data)
  }
}
