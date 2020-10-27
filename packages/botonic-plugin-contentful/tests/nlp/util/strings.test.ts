import { ltrim, replaceAll, rtrim, trim } from '../../../src/nlp/util/strings'

test('ltrim', () => {
  expect(ltrim('. hola', ' .')).toEqual('hola')
})

test('rtrim', () => {
  expect(rtrim('hola. ', ' .')).toEqual('hola')
})

test('trim', () => {
  expect(trim(' hola..', ' .')).toEqual('hola')
})

test('replaceAll', () => {
  expect(replaceAll('$me$at', '$', '')).toEqual('meat')
})
