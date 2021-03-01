import { join } from 'path'

import { DatabaseManager } from '../../../src/embeddings/database-manager'
import { DataLoader } from '../../../src/loaders/data-loader'
import { Preprocessor } from '../../../src/preprocess/preprocessor'
import { BotonicNer } from '../../../src/tasks/ner/botonic-ner'
import { NerModelLoader } from '../../../src/tasks/ner/loaders/ner-model-loader'

describe('Botonic NER', () => {
  test('Loading model', async () => {
    const ner = BotonicNer.from(
      await NerModelLoader.from(join(__dirname, '..', '..', 'utils', 'model'))
    )
    expect(ner.model.name).toEqual('BiLstmNerModel')
    expect(ner.locale).toEqual('en')
    expect(ner.maxLength).toEqual(12)
    expect(ner.entities).toEqual(['O', 'product', 'color', 'material', 'size'])
    expect(ner.vocabulary).toEqual([
      '<PAD>',
      '<UNK>',
      'i',
      'looking',
      'a',
      'size',
      'xxs',
      'wool',
      'belts',
      'xs',
      'hate',
      'gray',
      'linen',
      'hat',
      'hoodie',
      'm',
      '?',
      'jacket',
      's',
      'blue',
      'leather',
      'pink',
      't-shirt',
      'fur',
      'cotton',
      'xl',
      'shirt',
      'l',
      'love',
      '.',
      'xxl',
      'red',
      'can',
      'someone',
      'tell',
      'where',
      'buy',
      'want',
      'return',
      'not',
      'white',
      'orange',
      'sale',
      'brown',
      'allergic',
      'black',
      'material',
      'jeans',
      'understand',
      'people',
      'coats',
      'clothes',
      'new',
      'trousers',
      'who',
      'wears',
      'coat',
    ])
  })
  test('Load data', () => {
    const ner = BotonicNer.with('en', 12)

    const { train, test } = ner.loadData(
      new DataLoader(
        join(__dirname, '..', '..', 'utils', 'data', 'shopping.yaml')
      )
    )
    expect(train.length).toEqual(4)
    expect(test.length).toEqual(1)
  })

  test('Set stopwords', () => {
    const ner = BotonicNer.with('en', 12)

    ner.loadPreprocessor(new Preprocessor('en', 12))
    ner.stopwords = ['new', 'stopwords']
    expect(ner.stopwords).toEqual(['new', 'stopwords'])
  })

  test('Generate vocabulary', () => {
    const ner = BotonicNer.with('en', 12)

    ner.loadPreprocessor(new Preprocessor('en', 12))
    ner.generateVocabulary([
      { text: 'this is a simple test', class: '', entities: [] },
    ])
    expect(ner.vocabulary).toEqual(['<PAD>', '<UNK>', 'a', 'simple', 'test'])
  })

  test('Create model', async () => {
    const ner = BotonicNer.with('en', 12)

    const { train } = ner.loadData(
      new DataLoader(
        join(__dirname, '..', '..', 'utils', 'data', 'shopping.yaml')
      )
    )
    ner.loadPreprocessor(new Preprocessor('en', 12))
    ner.generateVocabulary(train)
    ner.compile()
    await ner.createModel('biLstm', new DatabaseManager('en', 'glove', 50))
    expect(ner.model.name).toEqual('BiLstmNerModel')
  })

  test('Evaluate model', async () => {
    const ner = BotonicNer.with('en', 12)

    const { train, test } = ner.loadData(
      new DataLoader(
        join(__dirname, '..', '..', 'utils', 'data', 'shopping.yaml')
      )
    )
    ner.loadPreprocessor(new Preprocessor('en', 12))
    ner.generateVocabulary(train)
    ner.compile()
    await ner.createModel('biLstm', new DatabaseManager('en', 'glove', 50))
    await ner.train(train, 4, 8)
    const { loss, accuracy } = await ner.evaluate(test)
    expect(loss).toBeLessThan(1)
    expect(accuracy).toBeGreaterThan(0.5)
  })

  test('Recognize entities', async () => {
    const ner = BotonicNer.with('en', 12)

    const { train } = ner.loadData(
      new DataLoader(
        join(__dirname, '..', '..', 'utils', 'data', 'shopping.yaml')
      )
    )
    ner.loadPreprocessor(new Preprocessor('en', 12))
    ner.generateVocabulary(train)
    ner.compile()
    await ner.createModel('biLstm', new DatabaseManager('en', 'glove', 50))
    await ner.train(train, 4, 8)
    const entities = ner.recognizeEntities('I love this t-shirt')
    expect(entities.length).toEqual(3)
  })
})
