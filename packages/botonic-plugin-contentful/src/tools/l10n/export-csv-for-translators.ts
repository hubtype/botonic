import { ErrorReportingCMS } from '../../cms'
import { Contentful } from '../../contentful/cms-contentful'
import { ContentFieldType } from '../../manage-cms'
import { I18nField } from '../../manage-cms/fields'
import { Locale } from '../../nlp'
import { ContentfulOptions } from '../../plugin'
import { CsvExport, skipEmptyStrings } from './csv-export'

export class PostProcessor {
  constructor(readonly targetLocale: string) {}

  urlAutoTrans(field: I18nField): I18nField {
    if (!this.targetLocale || this.targetLocale.length < 5) {
      return field
    }
    if (field.name != ContentFieldType.URL) {
      return field
    }
    const convertCountry = (chunk: string) => {
      if (chunk.length != 2) {
        return chunk
      }
      const country = this.targetLocale.substr(3).toLowerCase()
      console.log(
        `Replacing part of URL '${field.value}': from '${chunk}' to '${country}'`
      )
      return country
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
  targetLocale: Locale | undefined
) {
  const cms = new ErrorReportingCMS(new Contentful(options))
  const postProcess = targetLocale ? new PostProcessor(targetLocale) : undefined
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
const targetLocale = process.argv[7]

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
      targetLocale
    )
    console.log('done')
  } catch (e) {
    console.error(e)
  }
}

// void tells linters that we don't want to wait for promise
// await in main requires esnext
void main()
