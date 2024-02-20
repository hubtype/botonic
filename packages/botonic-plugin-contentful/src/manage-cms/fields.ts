import {
  CmsException,
  Content,
  ContentType,
  TopContent,
  TopContentType,
} from '../cms'
import { isOfType } from '../util/enums'

export enum ContentFieldType {
  TEXT = 'Text',
  SHORT_TEXT = 'Short text',
  KEYWORDS = 'Keywords',
  TITLE = 'Title',
  SUBTITLE = 'Subtitle',
  BUTTONS = 'Buttons',
  ELEMENTS = 'Elements',
  IMAGE = 'Image',
  PIC = 'pic',
  URL = 'URL',
  PAYLOAD = 'payload',
  NAME = 'Name',
  BUTTONS_STYLE = 'Buttons Style',
  FOLLOW_UP = 'FollowUp',
  TARGET = 'Target',
  QUEUE = 'Queue',
  HANDOFF_QUEUE = 'Handoff Queue',
  MESSAGE = 'Message',
  FAIL_MESSAGE = 'Fail Message',
  AGENT_EMAIL = 'Agent Email',
  AGENT_ID = 'Agent Id',
  ON_FINISH = 'On Finish',
  SHADOWING = 'Shadowing',
  INPUT_TYPE = 'Input Type',
}

export enum ContentFieldValueType {
  STRING = 'string',
  STRING_ARRAY = 'string[]',
  REFERENCE = 'reference',
  REFERENCE_ARRAY = 'reference[]',
  ASSET = 'asset',
  BOOLEAN = 'boolean',
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
    readonly isLocalized: boolean
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

  getValue(content: Content): any {
    if (this.fieldType == ContentFieldType.SHORT_TEXT) {
      return (content as TopContent).common.shortText
    } else if (this.fieldType == ContentFieldType.KEYWORDS) {
      return (content as TopContent).common.keywords
    }
    return (content as any)[this.cmsName]
  }

  isNotEmptyAt(content: Content): boolean {
    const val = this.getValue(content)
    if (Array.isArray(val)) {
      return val.length > 0
    }
    return val
  }
}

export const CONTENT_FIELDS = new Map<ContentFieldType, ContentField>(
  pairs([
    new ContentField(
      ContentFieldType.TEXT,
      'text',
      ContentFieldValueType.STRING,
      true
    ),
    new ContentField(
      ContentFieldType.SHORT_TEXT,
      'shortText',
      ContentFieldValueType.STRING,
      true
    ),
    new ContentField(
      ContentFieldType.KEYWORDS,
      'keywords',
      ContentFieldValueType.STRING_ARRAY,
      true
    ),
    new ContentField(
      ContentFieldType.TITLE,
      'title',
      ContentFieldValueType.STRING,
      true
    ),
    new ContentField(
      ContentFieldType.SUBTITLE,
      'subtitle',
      ContentFieldValueType.STRING,
      true
    ),
    new ContentField(
      ContentFieldType.BUTTONS,
      'buttons',
      ContentFieldValueType.REFERENCE_ARRAY,
      true
    ),
    new ContentField(
      ContentFieldType.ELEMENTS,
      'elements',
      ContentFieldValueType.REFERENCE_ARRAY,
      true
    ),
    new ContentField(
      ContentFieldType.IMAGE,
      'image',
      ContentFieldValueType.ASSET,
      true
    ),
    new ContentField(
      ContentFieldType.PIC,
      'pic',
      ContentFieldValueType.ASSET,
      true
    ),
    new ContentField(
      ContentFieldType.URL,
      'url',
      ContentFieldValueType.STRING,
      true
    ),
    new ContentField(
      ContentFieldType.PAYLOAD,
      'payload',
      ContentFieldValueType.STRING,
      true
    ),
    new ContentField(
      ContentFieldType.NAME,
      'name',
      ContentFieldValueType.STRING,
      true
    ),
    new ContentField(
      ContentFieldType.BUTTONS_STYLE,
      'buttonsStyle',
      ContentFieldValueType.STRING,
      true
    ),
    new ContentField(
      ContentFieldType.FOLLOW_UP,
      'followup',
      ContentFieldValueType.REFERENCE,
      true
    ),
    new ContentField(
      ContentFieldType.TARGET,
      'target',
      ContentFieldValueType.REFERENCE,
      true
    ),
    new ContentField(
      ContentFieldType.QUEUE,
      'queue',
      ContentFieldValueType.STRING,
      true
    ),
    new ContentField(
      ContentFieldType.HANDOFF_QUEUE,
      'queue',
      ContentFieldValueType.REFERENCE,
      true
    ),
    new ContentField(
      ContentFieldType.MESSAGE,
      'message',
      ContentFieldValueType.REFERENCE,
      true
    ),
    new ContentField(
      ContentFieldType.FAIL_MESSAGE,
      'failMessage',
      ContentFieldValueType.REFERENCE,
      true
    ),
    new ContentField(
      ContentFieldType.AGENT_EMAIL,
      'agentEmail',
      ContentFieldValueType.STRING,
      true
    ),
    new ContentField(
      ContentFieldType.AGENT_ID,
      'agentId',
      ContentFieldValueType.STRING,
      true
    ),
    new ContentField(
      ContentFieldType.ON_FINISH,
      'onFinish',
      ContentFieldValueType.REFERENCE,
      true
    ),
    new ContentField(
      ContentFieldType.SHADOWING,
      'shadowing',
      ContentFieldValueType.BOOLEAN,
      true
    ),
    new ContentField(
      ContentFieldType.INPUT_TYPE,
      'type',
      ContentFieldValueType.STRING,
      true
    ),
  ])
)

function pairs(cfs: ContentField[]): [ContentFieldType, ContentField][] {
  return cfs.map(cf => [cf.fieldType, cf])
}

export function contentFieldByCmsName(cmsName: string): ContentField {
  for (const cf of CONTENT_FIELDS.values()) {
    if (cf.cmsName == cmsName) {
      return cf
    }
  }
  throw new CmsException(`No ContentField found for cmsName ${cmsName}`)
}

export class I18nField {
  constructor(
    readonly name: ContentFieldType,
    readonly value: string
  ) {}
}

/**
 * Only contains i18nalizable fields (used by tools to detect which fields need to be imported/deleted)
 * TODO add all fields
 */
const FIELDS_PER_CONTENT_TYPE: { [type: string]: ContentFieldType[] } = {
  [ContentType.BUTTON]: [ContentFieldType.TEXT],
  [ContentType.CAROUSEL]: [],
  [ContentType.ELEMENT]: [
    ContentFieldType.TITLE,
    ContentFieldType.SUBTITLE,
    ContentFieldType.BUTTONS,
  ],
  [ContentType.STARTUP]: [ContentFieldType.TEXT, ContentFieldType.BUTTONS],
  [ContentType.TEXT]: [ContentFieldType.TEXT, ContentFieldType.BUTTONS],
  [ContentType.URL]: [ContentFieldType.URL],
  [ContentType.PAYLOAD]: [ContentFieldType.PAYLOAD],
}

/**
 * Adds common fields to FIELDS_PER_CONTENT_TYPE
 * IMPORTANT @see FIELDS_PER_CONTENT_TYPE
 */
export function getFieldsForContentType(
  contentType: ContentType
): ContentFieldType[] {
  let fields = FIELDS_PER_CONTENT_TYPE[contentType]
  if (!fields) {
    throw new CmsException(`Invalid content type ${contentType}`)
  }
  fields = [...fields]
  if (isOfType(contentType, TopContentType)) {
    fields.push(ContentFieldType.KEYWORDS)
    fields.push(ContentFieldType.SHORT_TEXT)
  }
  return fields
}
