import { StemmerEs } from '../../../../src/preprocess/engines/es/stemmer-es'

describe('Spanish stemmer', () => {
  test('stemming sentence', () => {
    const stemmer = new StemmerEs()
    expect(stemmer.stem(['probando', 'caminado'])).toEqual(['prob', 'camin'])
  })
})
