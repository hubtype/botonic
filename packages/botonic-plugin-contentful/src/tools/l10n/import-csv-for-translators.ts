import { CsvImport, StringFieldImporter } from './csv-import'
import { ManageContentful } from '../../contentful/manage'
import { ManageContext } from '../../manage-cms'
import { ContentfulOptions } from '../../plugin'
import { isOfType } from '../../util/enums'

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

export enum ImportType {
  DRY = 'DRY', //parse files but do write to CM
  NO_OVERWRITE = 'NO_OVERWRITE', // publishes the content, but fails if fields for this locale already have value
  OVERWRITE = 'OVERWRITE', // modifies previous value, but leaves it in UNPUBLISHED state
}

const spaceId = process.argv[2]
const environment = process.argv[3]
const accessToken = process.argv[4]
const locale = process.argv[5]
const fileName = process.argv[6]
const importType = String(process.argv[7])
if (!isOfType(importType, ImportType)) {
  throw Error(`${importType} is not a valid value`)
}

if (process.argv.length < 8 || process.argv[2] == '--help') {
  console.error(
    `Usage: space_id environment access_token locale filename [${Object.values(
      ImportType
    ).join('|')}]`
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
        preview: importType == ImportType.OVERWRITE,
        dryRun: importType == ImportType.DRY,
        allowOverwrites: importType == ImportType.OVERWRITE,
      },
      fileName
    )
    console.log('done')
  } catch (e) {
    console.error(e)
  }
  if (importType == ImportType.OVERWRITE) {
    console.log(
      "Remember that you'll need to publish the changed contents from contentful.com"
    )
  }
}

// void tells linters that we don't want to wait for promise
// await in main requires esnext
void main()
