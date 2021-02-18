import { Preprocessor } from '../../src/preprocess/preprocessor'

describe('Data Preprocessing', () => {
  test('Unsupported locale', () => {
    expect(() => {
      new Preprocessor('ca', 16)
    }).toThrowError()
  })

  test('Split samples into train and test sets', () => {
    const preprocessor = new Preprocessor('en', 10)
    const { train, test } = preprocessor.trainTestSplit(
      [
        { text: 'Where is my order?', entities: [] },
        { text: 'I want this t-shirt', entities: [] },
        { text: 'I want to return this coat', entities: [] },
        { text: 'I love this jacket', entities: [] },
        { text: 'Where can I buy this shirt', entities: [] },
      ],
      0.2
    )
    expect(train.length).toEqual(4)
    expect(test.length).toEqual(1)
  })

  test('Generate vocabulary', () => {
    const preprocessor = new Preprocessor('en', 10)
    expect(
      preprocessor.generateVocabulary([
        { text: 'Where is my order?', entities: [] },
        { text: 'I want this t-shirt', entities: [] },
      ])
    ).toEqual(['where', 'order', '?', 'i', 'want', 't-shirt'])
  })
})
