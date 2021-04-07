import { trainTestSplit } from '../../src/preprocess/selection'

describe('Data split', () => {
  test('Split samples into train and test sets', () => {
    const { trainSet, testSet } = trainTestSplit(
      [
        { text: 'Where is my order?', entities: [], class: '' },
        { text: 'I want this t-shirt', entities: [], class: '' },
        { text: 'I want to return this coat', entities: [], class: '' },
        { text: 'I love this jacket', entities: [], class: '' },
        { text: 'Where can I buy this shirt', entities: [], class: '' },
      ],
      0.2
    )
    expect(trainSet.length).toEqual(4)
    expect(testSet.length).toEqual(1)
  })
})
