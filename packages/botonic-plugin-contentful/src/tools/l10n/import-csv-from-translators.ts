import { CMS } from '../../cms'
import { CmsInfo } from '../../cms/cms-info'
import { MessageContentInverseTraverser } from '../../cms/visitors/message-visitors'
import {
  createCms,
  createCmsInfo,
  createManageCms,
} from '../../contentful/factories'
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
  info: CmsInfo,
  context: ManageContext,
  options: ReadCsvOptions
) {
  const reachableFromButtons = new MessageContentInverseTraverser(
    cms,
    info,
    context,
    { ignoreFollowUps: true }
  )
  const deleter = new ContentDeleter(manageCms, reachableFromButtons, context)
  const updater = new ImportContentUpdater(
    manageCms,
    cms,
    info,
    context,
    deleter
  )
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
  console.log(
    `Usage: space_id environment delivery_token mgmnt_token locale filename [${Object.values(
      ImportType
    ).join('|')}] duplicate_references`
  )
  console.log(
    `duplicate_references: if 'true', it will copy also the buttons, element images and assets of all contents ` +
      `(not only the ones in the input file)`
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
  process.argv[9].toLowerCase() == 'true'
    ? true
    : process.argv[9].toLowerCase() == 'false'
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

    const cmsOptions = {
      spaceId,
      accessToken: deliverAccessToken,
      environment,
      resumeErrors: true,
    }
    const cms = createCms(cmsOptions)
    const info = createCmsInfo(cmsOptions)
    const manageCms = createManageCms({
      spaceId,
      accessToken: manageAccessToken,
      environment,
    })

    if (duplicateReferences) {
      console.log('Duplicating reference fields')
      await duplicateReferenceFields(manageCms, cms, info, manageContext)
    }
    await readCsvForTranslators(manageCms, cms, info, manageContext, {
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
  info: CmsInfo,
  manageContext: ManageContext
) {
  const referenceDuplicator = new ReferenceFieldDuplicator(
    cms,
    info,
    manageCms,
    manageContext
  )
  await referenceDuplicator.duplicateReferenceFields()
  await referenceDuplicator.duplicateAssetFiles()
}

// void tells linters that we don't want to wait for promise
// await in main requires esnext
void main()
