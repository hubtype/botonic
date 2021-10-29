import { BotonicOutputParser } from '../../src/output-parser'

// @ts-ignore
const { expect } = global

export class BotonicOutputParserTester extends BotonicOutputParser {
  constructor() {
    super()
  }
  parseResponseAndAssert(botResponse: string, expected) {
    const sut = this.xmlToMessageEvents(botResponse)
    sut.forEach((s, i) => {
      expect(s).toEqual({
        ...expected[i],
      })
    })
  }
  inputToBotonicEventAndAssert(userInput, expected) {
    const sut = this.inputToBotonicEvent(userInput)
    expect(sut).toEqual(expected)
  }
}
