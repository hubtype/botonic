import { Parser } from '../parser/parser'
import { Data } from '../parser/types'

export class DataLoader {
  data: Data
  constructor(path: string) {
    this.data = Parser.parse(path)
  }
}
