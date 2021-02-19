import { trainTestSplit } from '../../src/preprocess/selection'

describe('Data split', () => {
  test('Split samples into train and test sets', () => {
    const { train, test } = trainTestSplit(
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
})
