import { preprocess, rootLocale } from '../../src/nlp/locales'

test('TEST: preprocess', () => {
  expect(preprocess('es_ES', ' ÑÇáü òL·l ')).toEqual('ncau ol·l')
})

test('TEST: rootLocale', () => {
  expect(rootLocale('es_ES')).toEqual('es')
  expect(rootLocale('en')).toEqual('en')
})
