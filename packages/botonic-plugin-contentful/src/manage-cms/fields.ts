import { CmsException } from '../cms'

export enum ContentFieldType {
  TEXT = 'Text',
  SHORT_TEXT = 'Short text',
  KEYWORDS = 'Keywords',
  TITLE = 'Title',
  SUBTITLE = 'Subtitle',
  BUTTONS = 'Buttons',
}

export enum ContentFieldValueType {
  STRING = 'string',
  STRING_ARRAY = 'string[]',
  REFERENCE = 'reference',
  REFERENCE_ARRAY = 'reference[]',
}

export class ContentField {
  static STRING_ARRAY_SEPARATOR = ';'

  constructor(
    readonly fieldType: ContentFieldType,
    readonly cmsName: string,
    readonly valueType: ContentFieldValueType,
    readonly localized = false
  ) {}

  parse(fieldValue: string): any {
    switch (this.valueType) {
      case ContentFieldValueType.STRING:
        return fieldValue
      case ContentFieldValueType.STRING_ARRAY:
        return fieldValue
          .split(ContentField.STRING_ARRAY_SEPARATOR)
          .map(kw => kw.trim())
      default:
        throw new CmsException(`${this.valueType} cannot be parsed yet`)
    }
  }
}

/* eslint-disable prettier/prettier*/
export const CONTENT_FIELDS = new Map<ContentFieldType, ContentField>(
  pairs([
    new ContentField(ContentFieldType.TEXT, 'text', ContentFieldValueType.STRING),
    new ContentField(ContentFieldType.SHORT_TEXT, 'shortText', ContentFieldValueType.STRING),
    new ContentField(ContentFieldType.KEYWORDS, 'keywords', ContentFieldValueType.STRING_ARRAY),
    new ContentField(ContentFieldType.TITLE, 'title', ContentFieldValueType.STRING),
    new ContentField(ContentFieldType.SUBTITLE, 'subtitle', ContentFieldValueType.STRING),
    new ContentField(ContentFieldType.BUTTONS, 'buttons', ContentFieldValueType.REFERENCE_ARRAY),
  ]))
/* eslint-enable prettier/prettier*/

function pairs(cfs: ContentField[]): [ContentFieldType, ContentField][] {
  return cfs.map(cf => [cf.fieldType, cf])
}
