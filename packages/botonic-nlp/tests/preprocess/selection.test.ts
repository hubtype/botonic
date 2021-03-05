import { trainTestSplit } from '../../src/preprocess/selection'

describe('Data split', () => {
  test('Split samples into train and test sets', () => {
    const { train, test } = trainTestSplit(
      [
        { text: 'Where is my order?', entities: [], class: '' },
        { text: 'I want this t-shirt', entities: [], class: '' },
        { text: 'I want to return this coat', entities: [], class: '' },
        { text: 'I love this jacket', entities: [], class: '' },
        { text: 'Where can I buy this shirt', entities: [], class: '' },
      ],
      0.2
    )
    expect(train.length).toEqual(4)
    expect(test.length).toEqual(1)
  })
})
