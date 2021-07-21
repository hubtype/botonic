import * as contentful from 'contentful-management'

export class SpaceManager {
  constructor(
    readonly spaceId: string,
    readonly environment: string,
    readonly accessToken: string
  ) {}

  /**
   * Creates a locale. Useful for locales which don't exist in contentful.com
   * (eg en_CH)
   */
  async createLocale(
    longName: string,
    code: string,
    fallbackCode: string | undefined
  ): Promise<void> {
    const client = contentful.createClient({
      accessToken: this.accessToken,
    })
    await client
      .getSpace(this.spaceId)
      .then(space => space.getEnvironment(this.environment))
      .then(environment =>
        environment.createLocale({
          name: longName,
          code: code,
          // @ts-ignore a bug fallbackCode type?
          fallbackCode,
          optional: true,
        })
      )
      .then(locale => console.log(`Created locale ${locale.code}`))
      .catch(console.error)
  }
}
console.log('PROCE', process.argv)
if (process.argv.length < 7 || process.argv[2] == '--help') {
  console.warn(
    `Usage: space_id environment access_token locale_name locale_code`
  )
  console.warn(
    'It creates a new locale without fallback in contentful.com with the specified name' +
      '. Useful for locales not available such as English on a non-English speaking country'
  )
  // eslint-disable-next-line no-process-exit
  process.exit(1)
}

const spaceId = process.argv[2]
const environment = process.argv[3]
const accessToken = process.argv[4]
const longLocaleName = process.argv[5]
const localeCode = process.argv[6]

const manager = new SpaceManager(spaceId, environment, accessToken)
void manager.createLocale(longLocaleName, localeCode, undefined)
