import { Dataset } from '../../src/dataset/dataset'

describe('Dataset', () => {
  const sut = new Dataset(
    ['BuyProduct', 'ReturnProduct'],
    ['product', 'material'],
    [
      { text: 'I want to buy this', class: 'BuyProduct', entities: [] },
      { text: 'I want to return this', class: 'ReturnProduct', entities: [] },
      {
        text: 'I would like to return it',
        class: 'ReturnProduct',
        entities: [],
      },
      { text: 'I would like to buy it', class: 'BuyProduct', entities: [] },
    ]
  )

  test('Split Dataset', () => {
    const { trainSet, testSet } = sut.split(0.25)
    expect(trainSet.length).toEqual(3)
    expect(testSet.length).toEqual(1)
  })
})
