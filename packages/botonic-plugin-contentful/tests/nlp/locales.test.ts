import { buildLocale, preprocess, rootLocale } from '../../src/nlp/locales'

test('TEST: preprocess', () => {
  expect(preprocess('es-ES', ' ÑÇáü òL·l ')).toEqual('ncau ol·l')
})

test('TEST: rootLocale', () => {
  expect(rootLocale('es-ES')).toEqual('es')
  expect(rootLocale('en')).toEqual('en')
})

test('TEST: buildLocale', () => {
  expect(buildLocale('ES', 'es')).toEqual('es-ES')
  expect(buildLocale('EN', undefined)).toEqual('en')
})
