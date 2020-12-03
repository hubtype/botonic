import {
  buildLocale,
  countryFromLocale,
  fixLocale,
  languageFromLocale,
  preprocess,
} from '../../src/nlp/locales'

test('TEST: preprocess', () => {
  expect(preprocess('es-ES', ' ÑÇáü òL·l ')).toEqual('ncau ol·l')
})

test('TEST: languageFromLocale', () => {
  expect(languageFromLocale('es-ES')).toEqual('es')
  expect(languageFromLocale('en')).toEqual('en')
})

test('TEST: countryFromLocale', () => {
  expect(countryFromLocale('es-AR')).toEqual('AR')
  expect(countryFromLocale('es')).toEqual('')
})

test('TEST: buildLocale', () => {
  expect(buildLocale('ES', 'es')).toEqual('es-ES')
  expect(buildLocale('EN', undefined)).toEqual('en')
})

test('TEST: fixLocale', () => {
  expect(fixLocale('ES')).toEqual('es')
  expect(fixLocale('es-ES')).toEqual('es-ES')
  expect(fixLocale('ES-es')).toEqual('es-ES')
})
