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
      .then(locale => console.log(`Created locale ${locale.name}`))
      .catch(console.error)
  }
}

const spaceId = process.argv[2]
const environment = process.argv[3]
const accessToken = process.argv[4]
const longLocaleName = process.argv[5]
const localeCode = process.argv[6]

const manager = new SpaceManager(spaceId, environment, accessToken)
void manager.createLocale(longLocaleName, localeCode, undefined)
