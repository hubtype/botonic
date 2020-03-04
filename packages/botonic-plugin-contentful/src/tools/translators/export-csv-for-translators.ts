import { CsvExport, skipEmptyStrings } from './csv-export'
import { Locale } from '../../nlp'
import { Contentful } from '../../contentful'

async function writeCsvForTranslators(
  spaceId: string,
  environment: string,
  accessToken: string,
  locales: Locale[]
) {
  const cms = new Contentful({
    spaceId,
    accessToken,
    environment,
  })
  const exporter = new CsvExport({
    stringFilter: skipEmptyStrings,
  })
  const promises = locales.map((from: string) =>
    exporter.write(`contentful_${from}.csv`, cms, from)
  )
  await Promise.all(promises)
}

const spaceId = process.argv[2]
const token = process.argv[3]
const locales = process.argv.slice(4) as Locale[]
console.log(process.execArgv)
if (process.argv.length < 5) {
  console.error(`Usage: space_id access_token language`)
  process.exit(1)
}

async function main() {
  try {
    await writeCsvForTranslators(spaceId, 'master', token, locales)
    console.log('done')
  } catch (e) {
    console.error(e)
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main().then(() => {
  console.log('done')
})
