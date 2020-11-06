import { CmsException, ContentType } from '../cms'

export enum ContentFieldType {
  TEXT = 'Text',
  SHORT_TEXT = 'Short text',
  KEYWORDS = 'Keywords',
  TITLE = 'Title',
  SUBTITLE = 'Subtitle',
  BUTTONS = 'Buttons',
  IMAGE = 'Image',
  URL = 'URL',
}

export enum ContentFieldValueType {
  STRING = 'string',
  STRING_ARRAY = 'string[]',
  REFERENCE = 'reference',
  REFERENCE_ARRAY = 'reference[]',
  ASSET = 'asset',
}

export class ContentField {
  /**
   * Used for keywords.
   * Maybe we should use instead a comma, since it's error prone that in Excel
   * the array values are ; separated, but in contentful dashboard they must be
   * separated by commas (a workaround is adding a validation on contentful dashboard
   * to prevent ; on array fields)
   */
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
    new ContentField(
      ContentFieldType.TEXT,
      'text',
      ContentFieldValueType.STRING
    ),
    new ContentField(
      ContentFieldType.SHORT_TEXT,
      'shortText',
      ContentFieldValueType.STRING
    ),
    new ContentField(
      ContentFieldType.KEYWORDS,
      'keywords',
      ContentFieldValueType.STRING_ARRAY
    ),
    new ContentField(
      ContentFieldType.TITLE,
      'title',
      ContentFieldValueType.STRING
    ),
    new ContentField(
      ContentFieldType.SUBTITLE,
      'subtitle',
      ContentFieldValueType.STRING
    ),
    new ContentField(
      ContentFieldType.BUTTONS,
      'buttons',
      ContentFieldValueType.REFERENCE_ARRAY
    ),
    new ContentField(
      ContentFieldType.IMAGE,
      'pic',
      ContentFieldValueType.ASSET
    ),
    new ContentField(ContentFieldType.URL, 'url', ContentFieldValueType.STRING),
  ])
)
/* eslint-enable prettier/prettier*/

function pairs(cfs: ContentField[]): [ContentFieldType, ContentField][] {
  return cfs.map(cf => [cf.fieldType, cf])
}

export class I18nField {
  constructor(readonly name: ContentFieldType, readonly value: string) {}
}

export const FIELDS_PER_CONTENT_TYPE: { [type: string]: ContentFieldType[] } = {
  [ContentType.BUTTON]: [ContentFieldType.TEXT],
  [ContentType.STARTUP]: [ContentFieldType.SHORT_TEXT, ContentFieldType.TEXT],
  [ContentType.TEXT]: [ContentFieldType.SHORT_TEXT, ContentFieldType.TEXT],
  [ContentType.ELEMENT]: [ContentFieldType.TITLE, ContentFieldType.SUBTITLE],
  [ContentType.URL]: [ContentFieldType.SHORT_TEXT, ContentFieldType.URL],
}
