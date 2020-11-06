import { TokenStripper, TokenRange } from '../../src/nlp/token-stripper'
import { DEFAULT_SEPARATORS_REGEX, Normalizer, preprocess } from '../../src/nlp'

const LOCALE = 'es'
const normalizer = new Normalizer()

function tok(str: string) {
  return preprocess(LOCALE, str)
    .split(DEFAULT_SEPARATORS_REGEX)
    .filter(t => !!t)
}

test.each<any>([
  [
    ['hey', 'buenas', 'buenas tardes'],
    'buenas tardes teneis zapatos?',
    new TokenRange(0, 2),
  ],
  [['buenas tardes'], 'buenas zapatillas', undefined],
])(
  `TEST: search [%s] starts with '%s'`,
  (needles: string[], haystack: string, expected: TokenRange | undefined) => {
    const sut = new TokenStripper(
      { [TokenStripper.START_POSITION]: needles },
      LOCALE,
      normalizer
    )
    const range = sut.search(tok(haystack), TokenStripper.START_POSITION)
    expect(range).toEqual(expected)
  }
)

test.each<any>([
  [['deu', 'hasta luego'], 'gracias  .Hasta  luego', new TokenRange(1, 3)],
  [['hasta luego'], 'hasta', undefined],
  [['hasta luego'], 'luego', undefined],
])(
  `TEST: search [%s] ends with '%s'`,
  (needles: string[], haystack: string, expected: TokenRange | undefined) => {
    const sut = new TokenStripper(
      { [TokenStripper.END_POSITION]: needles },
      'es'
    )
    const range = sut.search(tok(haystack), TokenStripper.END_POSITION)
    expect(range).toEqual(expected)
  }
)

test.each<any>([
  // strip is not case sensitive
  [TokenStripper.END_POSITION, ['Thank you'], "I'm? THANK you.", "I'm?"],
  [
    TokenStripper.START_POSITION,
    ['buenos días', 'ey'],
    ' ey!! Buenos  dias, tenéis  zapatos?',
    'tenéis  zapatos?',
  ],
  [
    TokenStripper.END_POSITION,
    ['deu', 'hasta luego'],
    'hey  amigos.Hasta  luego',
    'hey  amigos',
  ],
  [TokenStripper.START_POSITION, ['hasta luego'], 'hasta', 'hasta'],
])(
  `TEST: strip %s %s from '%s'`,
  (pos: number, needles: string[], haystack: string, expected: string) => {
    const sut = new TokenStripper({ [pos]: needles }, LOCALE)
    expect(sut.strip(haystack, pos)).toEqual(expected)
  }
)
