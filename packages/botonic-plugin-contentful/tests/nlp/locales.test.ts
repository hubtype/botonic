import { preprocess } from '../../src/nlp/locales'

test('TEST normalize', () => {
  expect(preprocess('es', ' ÑÇáü òL·l ')).toEqual('ncau ol·l')
})
