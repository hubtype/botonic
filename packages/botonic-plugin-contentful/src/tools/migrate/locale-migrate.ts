import { ExportObject } from '../../contentful/export/export-object'
import { LocaleMigrator } from '../../contentful/export/locale-migrator'

if (process.argv.length < 7 || process.argv[2] == '--help') {
  console.error(
    `Usage: fromFile toFile fromLocale locale toLocale [removeLocales]`
  )
  // eslint-disable-next-line no-process-exit
  process.exit(1)
}

const fromFile = process.argv[1]
const toFile = process.argv[2]
const fromLocale = process.argv[3]
const toLocale = process.argv[4]
const removeLocales = process.argv.length > 5 ? process.argv[5] : ''

function main() {
  try {
    const exportObj = ExportObject.fromJsonFile(fromFile)
    const sut = new LocaleMigrator(
      fromLocale,
      toLocale,
      removeLocales.split(',')
    )
    sut.migrate(exportObj)
    exportObj.write(toFile)

    console.log('done')
  } catch (e) {
    console.error(e)
  }
}

main()
