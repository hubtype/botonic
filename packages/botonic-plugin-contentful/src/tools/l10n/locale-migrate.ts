import {
  LocaleMigrator,
  LocaleRemover,
} from '../../contentful/export/locale-migrator'
import { SpaceExport } from '../../contentful/export/space-export'

if (process.argv.length != 7 || process.argv[2] == '--help') {
  console.error(
    `Usage: fromFile toFile fromLocale locale toLocale [removeLocales]`
  )
  // eslint-disable-next-line no-process-exit
  process.exit(1)
}

const fromFile = process.argv[2]
const toFile = process.argv[3]
const fromLocale = process.argv[4]
const toLocale = process.argv[5]
const removeLocales = process.argv.length > 6 ? process.argv[6] : ''

function main() {
  try {
    const spaceExport = SpaceExport.fromJsonFile(fromFile)
    const migrator = new LocaleMigrator(fromLocale, toLocale)
    const remover = new LocaleRemover(removeLocales.split(','))

    migrator.migrate(spaceExport)
    remover.remove(spaceExport)

    spaceExport.write(toFile)
    console.log('done')
  } catch (e) {
    console.error(e)
  }
}

main()
