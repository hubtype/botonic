import { ErrorReportingCMS } from '../../cms'
import { Contentful } from '../../contentful/cms-contentful'
import { ContentFieldType } from '../../manage-cms'
import { I18nField } from '../../manage-cms/fields'
import { Locale } from '../../nlp'
import { ContentfulOptions } from '../../plugin'
import { CsvExport, skipEmptyStrings } from './csv-export'

export class PostProcessor {
  constructor(readonly targetLocaleOrCountry: string) {}

  urlAutoTrans(field: I18nField): I18nField {
    if (!this.targetLocaleOrCountry) {
      return field
    }
    if (field.name != ContentFieldType.URL) {
      return field
    }
    const convertCountry = (urlChunk: string) => {
      if (urlChunk.length != 2) {
        return urlChunk
      }
      const path = () => {
        const lang = this.targetLocaleOrCountry.substr(0, 2).toLowerCase()
        if (this.targetLocaleOrCountry.length == 2) {
          return lang
        }
        const country = this.targetLocaleOrCountry.substr(3).toLowerCase()
        return `${country}/${lang}`
      }
      const newChunk = path()
      console.log(
        `Replacing part of URL '${field.value}': from '${urlChunk}' to '${newChunk}'`
      )
      return newChunk
    }

    return new I18nField(
      field.name,
      field.value.split('/').map(convertCountry).join('/')
    )
  }
}

async function writeCsvForTranslators(
  options: ContentfulOptions,
  locale: Locale,
  fileName: string,
  targetLocaleOrCountry: Locale | undefined
) {
  const cms = new ErrorReportingCMS(new Contentful(options))
  const postProcess = targetLocaleOrCountry
    ? new PostProcessor(targetLocaleOrCountry)
    : undefined
  const exporter = new CsvExport(
    {
      stringFilter: skipEmptyStrings,
    },
    postProcess
      ? (field: I18nField) => postProcess!.urlAutoTrans(field)
      : undefined
  )
  return await exporter.write(fileName, cms, locale)
}

if (process.argv.length < 7 || process.argv[2] == '--help') {
  console.error(
    `Usage: space_id environment access_token locale filename [target_country]`
  )
  // eslint-disable-next-line no-process-exit
  process.exit(1)
}

const spaceId = process.argv[2]
const environment = process.argv[3]
const accessToken = process.argv[4]
const locale = process.argv[5]
const fileName = process.argv[6]
const targetLocaleOrCountry = process.argv[7]

async function main() {
  try {
    await writeCsvForTranslators(
      {
        spaceId,
        accessToken,
        environment,
        resumeErrors: true,
      },
      locale,
      fileName,
      targetLocaleOrCountry
    )
    console.log('done')
  } catch (e) {
    console.error(e)
  }
}

// void tells linters that we don't want to wait for promise
// await in main requires esnext
void main()
