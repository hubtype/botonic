import { normalize } from '../../src/nlp/locales'

test('TEST normalize', () => {
  expect(normalize('es', ' ÑÇáü òL·l ')).toEqual('ncau ol·l')
})
