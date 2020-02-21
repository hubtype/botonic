import { CsvExport } from './csv-export'
import { Locale } from '../../nlp'
import Contentful from '../../contentful'

async function writeCsvForTranslators(
  spaceId: string,
  accessToken: string,
  locales: Locale[]
) {
  const cms = new Contentful({
    spaceId: spaceId,
    accessToken: accessToken,
    environment: 'master',
  })
  const exporter = new CsvExport({
    // nameFilter: n => ['HOME_RETURN_URL'].includes(n),
  })
  const promises = locales.map((from: string) =>
    exporter.write(`contentful_${from}.csv`, cms, from)
  )
  return Promise.all(promises)
}

const spaceId = process.argv[2]
const token = process.argv[3]
const locales = process.argv.slice(4) as Locale[]
console.log(process.execArgv)
if (process.argv.length < 5) {
  console.error(`Usage: space_id access_token language`)
  process.exit(1)
}

writeCsvForTranslators(spaceId, token, locales).then(() => {
  console.log('done')
})
