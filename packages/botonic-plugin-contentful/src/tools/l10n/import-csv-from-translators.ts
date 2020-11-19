import { CMS } from '../../cms'
import { MessageContentInverseTraverser } from '../../cms/visitors/message-visitors'
import { createCms, createManageCms } from '../../contentful/factories'
import { ManageCms, ManageContext } from '../../manage-cms'
import { ContentDeleter } from '../../manage-cms/content-deleter'
import { isOfType } from '../../util/enums'
import { CsvImport } from './csv-import'
import { ImportContentUpdater, ImportRecordReducer } from './import-updater'
import { ReferenceFieldDuplicator } from './reference-field-duplicator'

export interface ReadCsvOptions {
  fname: string
  ignoreContentIds?: string[]
  resumeErrors?: boolean
}

async function readCsvForTranslators(
  manageCms: ManageCms,
  cms: CMS,
  context: ManageContext,
  options: ReadCsvOptions
) {
  const reachableFrom = new MessageContentInverseTraverser(cms, context)
  const deleter = new ContentDeleter(manageCms, reachableFrom, context)
  const updater = new ImportContentUpdater(manageCms, cms, context, deleter)
  const fieldImporter = new ImportRecordReducer(updater, {
    resumeErrors: options.resumeErrors,
  })
  const importer = new CsvImport(fieldImporter)
  await importer.import(options)
}

export enum ImportType {
  DRY = 'DRY', //parse files but do write to CM
  NO_OVERWRITE = 'NO_OVERWRITE', // publishes the content, but fails if fields for this locale already have value
  OVERWRITE = 'OVERWRITE', // modifies previous value, but leaves it in UNPUBLISHED state
  OVERWRITE_AND_PUBLISH = 'OVERWRITE_AND_PUBLISH', // overwrites previous value and publishes it (only for new spaces)
}

if (process.argv.length < 10 || process.argv[2] == '--help') {
  console.error(
    `Usage: space_id environment delivery_token mgmnt_token locale filename [${Object.values(
      ImportType
    ).join('|')}] duplicate_references`
  )
  // eslint-disable-next-line no-process-exit
  process.exit(1)
}

const spaceId = process.argv[2]
const environment = process.argv[3]
const deliverAccessToken = process.argv[4]
const manageAccessToken = process.argv[5]
const locale = process.argv[6]
const fileName = process.argv[7]
const importType = String(process.argv[8])
if (!isOfType(importType, ImportType)) {
  throw Error(`${importType} is not a valid value`)
}
const duplicateReferences =
  process.argv[9] == 'true'
    ? true
    : process.argv[9] == 'false'
    ? false
    : undefined
if (duplicateReferences == undefined) {
  throw Error("duplicateReferences argument must be 'true' or 'false'")
}

async function main() {
  try {
    if (importType == ImportType.NO_OVERWRITE) {
      console.warn(
        'Contents will be left in preview mode. Publish them from contentful.com'
      )
    }
    const manageContext = {
      locale,
      preview: importType == ImportType.OVERWRITE,
      dryRun: importType == ImportType.DRY,
      allowOverwrites: [
        ImportType.OVERWRITE,
        ImportType.OVERWRITE_AND_PUBLISH,
        ImportType.DRY,
      ].includes(importType as ImportType),
    }

    const cms = createCms({
      spaceId,
      accessToken: deliverAccessToken,
      environment,
      resumeErrors: true,
    })
    const manageCms = createManageCms({
      spaceId,
      accessToken: manageAccessToken,
      environment,
    })

    if (duplicateReferences) {
      console.log('Duplicating reference fields')
      await duplicateReferenceFields(manageCms, cms, manageContext)
    }
    await readCsvForTranslators(manageCms, cms, manageContext, {
      fname: fileName,
      resumeErrors: true,
      ignoreContentIds: [],
    })
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

async function duplicateReferenceFields(
  manageCms: ManageCms,
  cms: CMS,
  manageContext: ManageContext
) {
  const referenceDuplicator = new ReferenceFieldDuplicator(
    cms,
    manageCms,
    manageContext
  )
  await referenceDuplicator.duplicateReferenceFields()
  await referenceDuplicator.duplicateAssetFiles()
}

// void tells linters that we don't want to wait for promise
// await in main requires esnext
void main()
