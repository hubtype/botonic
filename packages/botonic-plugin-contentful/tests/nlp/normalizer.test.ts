import {
  DEFAULT_STOP_WORDS,
  EmptyTextException,
  Locale,
  NormalizedUtterance,
  Normalizer,
  StemmingBlackList,
  SUPPORTED_LOCALES,
  Word,
} from '../../src/nlp'

test.each<any>(SUPPORTED_LOCALES)(
  'TEST: consecutive separators %s are removed',
  (locale: Locale) => {
    const sut = new Normalizer()

    const utterances = sut.normalize(locale, 'xx!! yy!!')

    expect(utterances.stems).toHaveLength(2)
    expect(utterances.words).toEqual([
      new Word('xx', 'xx'),
      new Word('yy', 'yy'),
    ])
  }
)

test('TEST: sut.normalize stopWords can be customized', () => {
  const stopWords: { [locale: string]: string[] } = {
    es: ['noCountry'],
    es_ES: ['withCountry'],
  }
  const sut = new Normalizer(undefined, locale => stopWords[locale] || [])
  const input = 'digas withCountry noCountry'
  expect(sut.normalize('es', input).stems).toEqual(['dec', 'withcountry'])
  expect(sut.normalize('es_ES', input).stems).toEqual(['dec', 'nocountry'])
})

test.each<any>([
  [
    'es',
    'ponerse un toro',
    [new Word('ponerse', 'pon'), Word.StopWord('un'), new Word('toro', 'tor')],
  ],

  [
    'en',
    "you can't",
    [Word.StopWord('you'), new Word('ca', 'ca'), new Word('not', 'not')],
  ],

  [
    'pt',
    'depois disse-me',
    [Word.StopWord('depois'), new Word('disse', 'diss'), Word.StopWord('me')],
  ],

  [
    'pl',
    'gdziekolwiek JeŚć',
    [Word.StopWord('gdziekolwiek'), new Word('jesc', 'je')],
  ],
  ['tr', 'onlar uyudum', [Word.StopWord('onlar'), new Word('uyudum', 'uyudu')]],
  [
    'it',
    "all'ippodromo",
    [Word.StopWord('all'), new Word('ippodromo', 'ippodrom')],
  ],
  ['fr', "D'abord", [Word.StopWord('d'), new Word('abord', 'abord')]],
  ['de', 'Du kauftest', [Word.StopWord('du'), new Word('kauftest', 'kauft')]],
  [
    'ro',
    'Vorbesc cu tine',
    [new Word('vorbesc', 'vorb'), Word.StopWord('cu'), Word.StopWord('tine')],
  ],
  [
    'el',
    'Είναι μια καλή μέρα',
    [
      Word.StopWord('ειναι'),
      new Word('μια', 'μια'),
      new Word('καλη', 'καλ'),
      new Word('μερα', 'μερ'),
    ],
  ],
  [
    'cs',
    'Chystám se to koupit',
    [
      new Word('chystam', 'chystam'),
      Word.StopWord('se'),
      Word.StopWord('to'),
      new Word('koupit', 'koupit'),
    ],
  ],
  [
    'uk',
    'я з тобою розмовляю',
    [
      new Word('я', 'я'),
      Word.StopWord('з'),
      new Word('тобою', 'тоб'),
      new Word('розмовляю', 'розмовля'),
    ],
  ],
  [
    'hr',
    'ja ću pjevati',
    [Word.StopWord('ja'), Word.StopWord('cu'), new Word('pjevati', 'pjeva')],
  ],
  [
    'sk',
    'Máte jedálny lístok v angličtine',
    [
      Word.StopWord('mate'),
      new Word('jedalny', 'jedaln'),
      new Word('listok', 'listok'),
      Word.StopWord('v'),
      new Word('anglictine', 'anglick'),
    ],
  ],
  [
    'sl',
    'Tega ne moreš narediti',
    [
      Word.StopWord('tega'),
      Word.StopWord('ne'),
      new Word('mores', 'mores'),
      new Word('narediti', 'nared'),
    ],
  ],
])(
  'TEST: stemmer removes stopwords: lang=%s input="%j"',
  (locale: string, raw: string, words: Word[]) => {
    const sut = new Normalizer()
    expect(sut.normalize(locale, raw)).toEqual(
      new NormalizedUtterance(raw.toLowerCase(), words, false)
    )
  }
)

test('TEST: sut.normalize empty text', () => {
  const loc = 'es'
  const sut = new Normalizer()
  expect(() => sut.normalize(loc, ' ./ ')).toThrow(EmptyTextException)
})

test('TEST: sut.normalize es', () => {
  const loc = 'es'
  const sut = new Normalizer()
  expect(sut.normalize(loc, 'áá').stems).toEqual(['aa'])
  expect(sut.normalize(loc, ',./ áé  íó(óÑ)  ;').stems).toEqual([
    'ae',
    'io',
    'on',
  ])
  expect(
    sut.normalize(
      loc,
      'hola, hola!! pero realizar mi la un una de ya del pedido'
    ).stems
  ).toEqual(['realic', 'ped'])
})

test('TEST: sut.normalize ca', () => {
  const loc = 'ca'
  const sut = new Normalizer()
  expect(sut.normalize(loc, 'àí').stems).toEqual(['ai'])
  expect(sut.normalize(loc, ',./ àé  íò(óçÇ)  ;').stems).toEqual([
    'ae',
    'io',
    'oçç',
  ])
  expect(
    sut.normalize(
      loc,
      'ho hi però guanyés la meva un una de ja de les comandes'
    ).stems
  ).toEqual(['guany', 'comand'])
})

test('TEST: sut.normalize en', () => {
  const loc = 'en'
  const sut = new Normalizer()
  expect(sut.normalize(loc, 'realizing tokenization').stems).toEqual([
    'realiz',
    'token',
  ])
})

test('TEST: sut.normalize on locale with country', () => {
  const sut = new Normalizer()
  expect(sut.normalize('en_GB', 'realizing').stems).toEqual(['realiz'])
})

test.each<any>([['es'], ['ca'], ['en']])(
  'sut.normalize removes the stopwords for lang %s',
  (locale: Locale) => {
    const sut = new Normalizer()
    for (const stopWord of DEFAULT_STOP_WORDS[locale]) {
      const normalized = sut.normalize(locale, stopWord)
      expect(normalized.hasOnlyStopWords()).toEqual(true)
      expect(replaceI18nChars(stopWord, locale)).toStartWith(
        normalized.words[0].token
      )
      expect(sut.normalize(locale, stopWord + ' abcdex').stems).toEqual([
        'abcdex',
      ])
    }
  }
)

test('TEST: Normalizer does not stem blacklisted tokens', () => {
  const sut = new Normalizer({
    es: [
      new StemmingBlackList('perro', ['perro', 'can', 'cán', 'canes']),
      new StemmingBlackList('ey', []),
    ],
  })
  const normalized = sut.normalize(
    'es',
    'perro. ey gato pipican adios cán canes'
  )
  expect(normalized.stems).toEqual([
    'perro',
    'ey',
    'gat',
    'pipic',
    'adi',
    'perro',
    'perro',
  ])
})

function replaceI18nChars(word: string, locale: string): string {
  word = word
    .replace('á', 'a')
    .replace('à', 'a')
    .replace('ó', 'o')
    .replace('ò', 'o')
    .replace('í', 'i')
    .replace('ú', 'u')
    .replace('è', 'e')
    .replace('é', 'e')
  return word
}
