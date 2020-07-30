import { CsvImport, StringFieldImporter } from './csv-import'
import { ManageContentful } from '../../contentful/manage'
import { ManageContext } from '../../manage-cms'
import { ContentfulOptions } from '../../plugin'

async function readCsvForTranslators(
  contentfulOptions: ContentfulOptions,
  context: ManageContext,
  fname: string
) {
  const cms = new ManageContentful(contentfulOptions)
  const fieldImporter = new StringFieldImporter(cms, context)
  const importer = new CsvImport(fieldImporter)
  await importer.import(fname)
}

const spaceId = process.argv[2]
const environment = process.argv[3]
const accessToken = process.argv[4]
const locale = process.argv[5]
const fileName = process.argv[6]
const dryRun = Boolean(process.argv[7])

if (process.argv.length < 7 || process.argv[2] == '--help') {
  console.error(
    `Usage: space_id environment access_token locale filename [dry_run]`
  )
  // eslint-disable-next-line no-process-exit
  process.exit(1)
}

async function main() {
  try {
    console.warn(
      'Contents will be left in preview mode. Publish them from contentful.com'
    )
    await readCsvForTranslators(
      {
        spaceId,
        accessToken,
        environment,
      },
      {
        locale,
        preview: true,
        dryRun: dryRun,
      },
      fileName
    )
    console.log('done')
  } catch (e) {
    console.error(e)
  }
}

// void tells linters that we don't want to wait for promise
// await in main requires esnext
void main()
