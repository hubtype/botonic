import stringify from 'csv-stringify'
import * as fs from 'fs'
import sort from 'sort-stream'
import * as stream from 'stream'
import { promisify } from 'util'

import { BOTONIC_CONTENT_TYPES, ContentType, Handoff, Text } from '../../cms'
import { ResourceTypeNotFoundCmsException } from '../../cms/exceptions'
import {
  Button,
  CMS,
  CommonFields,
  Content,
  Element,
  StartUp,
  TopContent,
  Url,
} from '../../index'
import {
  ContentField,
  ContentFieldType,
  I18nField,
} from '../../manage-cms/fields'
import { Locale } from '../../nlp'

const finished = promisify(stream.finished)

type CsvLine = string[]

interface CsvExportOptions {
  readonly nameFilter?: (name: string) => boolean
  readonly stringFilter?: (text: string) => boolean
}

export const skipEmptyStrings = (str: string) => Boolean(str && str.trim())
/***
 * @see I18nEntryTraverser limitations.
 * It should be reimplemented without traversing field references.
 * Uses https://csv.js.org/stringify/api/
 */
export class CsvExport {
  private toFields: ContentToCsvLines

  constructor(
    private readonly options: CsvExportOptions,
    postprocessor = (field: I18nField) => field
  ) {
    this.toFields = new ContentToCsvLines(options, postprocessor)
  }

  static sortRows(a: string[], b: string[]): number {
    for (const i in a) {
      const cmp = a[i].localeCompare(b[i])
      if (cmp != 0) {
        return cmp
      }
    }
    return 0
  }

  async write(fname: string, cms: CMS, locale: Locale): Promise<void> {
    const stringifier = create_stringifier()
    const readable = stream.Readable.from(this.generate(cms, locale))
    const writable = readable
      .pipe(sort(CsvExport.sortRows))
      .pipe(stringifier)
      .pipe(fs.createWriteStream(fname))
    return this.toPromise(writable)
  }

  async toPromise(writable: stream.Writable): Promise<void> {
    return finished(writable)
  }

  async *generate(cms: CMS, from: Locale): AsyncGenerator<CsvLine> {
    // TODO use CmsInfo to restrict the types
    for (const model of [
      ...BOTONIC_CONTENT_TYPES,
      ContentType.URL,
      ContentType.HANDOFF,
    ]) {
      console.log(`Exporting contents of type ${model}`)
      try {
        const contents = await cms.contents(model, {
          locale: from,
          ignoreFallbackLocale: true,
        })
        for (const content of contents) {
          if (
            this.options.nameFilter &&
            !this.options.nameFilter(content.name)
          ) {
            continue
          }
          console.log('Exporting content', content.name.trim() || content.id)
          for (const field of this.toFields.getCsvLines(content)) {
            const TO_COLUMN = ''
            yield [...field, TO_COLUMN]
          }
        }
      } catch (e) {
        if (e instanceof ResourceTypeNotFoundCmsException) {
          console.error(
            `The space has no model '${e.resourceType}'. Skipping it.`
          )
        }
      }
    }
  }
}

export class ContentToCsvLines {
  constructor(
    private readonly options: CsvExportOptions,
    private readonly postprocessor?: (field: I18nField) => I18nField
  ) {}

  getCsvLines(content: Content): CsvLine[] {
    const columns = [content.contentType, content.name, content.id]
    let fields = this.getFields(content)
    if (this.options.stringFilter) {
      fields = fields.filter(f => this.options.stringFilter!(f.value))
    }
    const lines = fields.map(f => [...columns, f.name, f.value!])
    if (this.postprocessor) {
      const processed = fields.map(this.postprocessor)
      for (let i = 0; i < processed.length; i++) {
        if (processed[i].value != fields[i].value) {
          lines[i].push(processed[i].value)
        }
      }
    }
    return lines
  }

  getFields(content: Content): I18nField[] {
    if (content instanceof Button) {
      return [new I18nField(ContentFieldType.TEXT, content.text)]
    } else if (content instanceof StartUp) {
      return [
        ...this.getCommonFields(content.common),
        new I18nField(ContentFieldType.TEXT, content.text),
      ]
    } else if (content instanceof Text) {
      return [
        ...this.getCommonFields(content.common),
        new I18nField(ContentFieldType.TEXT, content.text),
      ]
    } else if (content instanceof Element) {
      return [
        new I18nField(ContentFieldType.TITLE, content.title),
        new I18nField(ContentFieldType.SUBTITLE, content.subtitle),
      ]
    } else if (content instanceof Url) {
      return [
        ...this.getCommonFields(content.common),
        new I18nField(ContentFieldType.URL, content.url),
      ]
    } else if (content instanceof Handoff) {
      return [...this.getCommonFields(content.common)]
    } else if (content instanceof TopContent) {
      return this.getCommonFields(content.common)
    }
    return []
  }

  getCommonFields(common: CommonFields): I18nField[] {
    return [
      new I18nField(ContentFieldType.SHORT_TEXT, common.shortText),
      // TODO process value based on ContentField.valueType
      new I18nField(
        ContentFieldType.KEYWORDS,
        common.keywords.join(ContentField.STRING_ARRAY_SEPARATOR)
      ),
    ]
  }
}

export function create_stringifier() {
  return stringify({
    escape: '"',
    delimiter: ';',
    quote: '"',
    quoted: true,
    record_delimiter: 'windows',
    header: true,
    columns: ['Model', 'Code', 'Id', 'Field', 'From', 'To'],
  })
}
