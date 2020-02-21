import {
  Button,
  Carousel,
  CMS,
  CommonFields,
  Content,
  ContentType,
  MESSAGE_TYPES,
  StartUp,
} from '../../index'
import { Locale } from '../../nlp'
import { Text, TopContent } from '../../cms'
import stringify from 'csv-stringify'
import * as stream from 'stream'
import * as fs from 'fs'
import { promisify } from 'util'

console.log(typeof stream.finished)
const finished = promisify(stream.finished)

class I18nField {
  constructor(readonly name: string, readonly value?: string) {}
}

interface CsvExportOptions {
  nameFilter?: (name: string) => boolean
}

/***
 * Uses https://csv.js.org/stringify/api/
 */
export class CsvExport {
  private toFields = new ContentToI18nFields()
  constructor(private readonly options: CsvExportOptions) {}

  create_stringifier() {
    return stringify({
      escape: '"',
      delimiter: ';',
      quote: '"',
      quoted: true,
      record_delimiter: 'windows',
      header: true,
      columns: ['Model', 'Id', 'Code', 'Field', 'From', 'To'],
    })
  }

  async write(fname: string, cms: CMS, locale: Locale): Promise<void> {
    const stringifier = this.create_stringifier()
    const readable = stream.Readable.from(this.generate(cms, locale))
    const writable = readable
      .pipe(stringifier)
      .pipe(fs.createWriteStream(fname))
    return this.toPromise(writable)
  }

  async toPromise(writable: stream.Writable): Promise<void> {
    return finished(writable)
  }

  async *generate(cms: CMS, from: Locale): AsyncGenerator<string[]> {
    for (const model of [...MESSAGE_TYPES, ContentType.BUTTON]) {
      const contents = await cms.contents(model, { locale: from })
      for (const content of contents) {
        if (this.options.nameFilter && !this.options.nameFilter(content.name)) {
          continue
        }
        console.log('Exporting content', content.name)
        for (const field of this.getI18nFields(content)) {
          const TO_COLUMN = ''
          yield [...field, TO_COLUMN]
        }
      }
    }
  }

  // TODO create a text TextFieldVisitor
  getI18nFields(content: Content): string[][] {
    const columns = [content.contentType, content.id, content.name]
    if (!(content instanceof TopContent)) {
      if (content instanceof Button) {
        return [[...columns, 'Text', content.text]]
      }
    }
    const fields = this.toFields.getFields(content)
    return fields.filter(f => f.value).map(f => [...columns, f.name, f.value!])
  }
}

class ContentToI18nFields {
  getFields(content: Content): I18nField[] {
    if (content instanceof StartUp) {
      return [
        ...this.getCommonFields(content.common),
        new I18nField('Text', content.text),
      ]
    } else if (content instanceof Text) {
      return [
        ...this.getCommonFields(content.common),
        new I18nField('Text', content.text),
      ]
    } else if (content instanceof Carousel) {
      const fields = this.getCommonFields(content.common)
      return fields.concat(
        ...content.elements.map(e => [
          new I18nField('Title', e.title),
          new I18nField('Subtitle', e.subtitle),
        ])
      )
    }
    return []
  }

  getCommonFields(common: CommonFields): I18nField[] {
    return [new I18nField('Short text', common.shortText)]
  }
}
