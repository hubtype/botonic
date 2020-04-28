import * as time from '../time'
import { Callback, TopContentId } from './callback'
import { SearchableBy } from './fields'
import { ContentType, MessageContentType, TopContentType } from './cms'
import { shallowClone } from '../util/objects'

export enum ButtonStyle {
  BUTTON = 0,
  QUICK_REPLY = 1,
}

/** Not a Content because it cannot have custom fields */
export class Asset {
  /**
   * @param type eg. image/jpeg
   * @param details depends on the type. eg the image size
   */
  constructor(
    readonly name: string,
    readonly url: string,
    readonly type?: string,
    readonly details?: any
  ) {}
}

/**
 * Any content deliverable from a CMS
 */
export abstract class Content {
  protected constructor(readonly contentType: ContentType) {}

  /** @return message if any issue detected */
  validate(): string | undefined {
    return undefined
  }

  abstract get id(): string
  abstract get name(): string

  static validateContents(contents: Content[]): string | undefined {
    const invalids = contents.map(c => c.validate()).filter(v => v)
    if (invalids.length == 0) {
      return undefined
    }
    return invalids.join('. ')
  }
}

/**
 * A self-contained content with {@link CommonFields}
 */
export abstract class TopContent extends Content {
  protected constructor(
    readonly common: CommonFields,
    readonly contentType: TopContentType
  ) {
    super(contentType)
  }

  get name(): string {
    return this.common.name
  }

  get id(): string {
    return this.common.id
  }

  get contentId(): TopContentId {
    return new TopContentId(this.contentType, this.id)
  }

  cloneWithFollowUp(newFollowUp: FollowUp | undefined): this {
    const clone = shallowClone(this)
    ;(clone as any).common = shallowClone(clone.common)
    ;(clone as any).common.followUp = newFollowUp
    return clone
  }
}

/**
 * Contents which have a correspondent Botonic React Message
 */
export abstract class MessageContent extends TopContent {
  protected constructor(
    readonly common: CommonFields,
    readonly contentType: MessageContentType
  ) {
    super(common, contentType)
  }
}

/**
 * When any {@link keywords} is detected on a user input, we can use display the {@link shortText} for users
 * to confirm their interest on this content
 * TODO move contentId o ContentType here?
 */
export class CommonFields {
  readonly shortText: string
  readonly keywords: string[]
  readonly searchableBy?: SearchableBy
  /** Useful when contents need to be replicated according to some criteria. Eg. country, company,...
   */
  readonly partitions: string[]
  readonly dateRange?: DateRangeContent
  readonly followUp?: FollowUp // TODO move to MessageContent

  constructor(
    readonly id: string,
    readonly name: string,
    opt?: {
      shortText?: string
      keywords?: string[]
      searchableBy?: SearchableBy
      partitions?: string[]
      dateRange?: DateRangeContent
      followUp?: FollowUp
    }
  ) {
    if (opt) {
      this.shortText = opt.shortText || ''
      this.keywords = opt.keywords || []
      this.searchableBy = opt.searchableBy
      this.partitions = opt.partitions || []
      this.dateRange = opt.dateRange
      this.followUp = opt.followUp
    } else {
      this.shortText = ''
      this.keywords = []
      this.partitions = []
    }
  }
}

export class Button extends Content {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly text: string,
    readonly callback: Callback
  ) {
    super(ContentType.BUTTON)
  }

  validate(): string | undefined {
    if (!this.text) {
      return `Button '${this.name}' without text`
    }
    if (!this.name) {
      return `Button with text '${this.text}' without name`
    }
    return undefined
  }

  cloneWithText(newText: string): this {
    const clone = shallowClone(this)
    ;(clone as any).text = newText
    return clone
  }
}

export class StartUp extends MessageContent {
  constructor(
    readonly common: CommonFields,
    readonly imgUrl: string | undefined,
    readonly text: string,
    readonly buttons: Button[]
  ) {
    super(common, ContentType.STARTUP)
  }

  validate(): string | undefined {
    return Content.validateContents(this.buttons)
  }

  cloneWithText(newText: string): this {
    const clone = shallowClone(this)
    ;(clone as any).text = newText
    return clone
  }

  cloneWithButtons(buttons: Button[]): this {
    const clone = shallowClone(this)
    ;(clone as any).buttons = buttons
    return clone
  }
}

export class Carousel extends MessageContent {
  constructor(
    readonly common: CommonFields,
    readonly elements: Element[] = []
  ) {
    super(common, ContentType.CAROUSEL)
  }

  validate(): string | undefined {
    return Content.validateContents(this.elements)
  }

  cloneWithElements(elements: Element[]): this {
    const clone = shallowClone(this)
    ;(clone as any).elements = elements
    return clone
  }
}

/** Part of a carousel */
export class Element extends Content {
  readonly name: string
  constructor(
    readonly id: string,
    readonly buttons: Button[],
    readonly title: string,
    readonly subtitle = '',
    readonly imgUrl = ''
  ) {
    super(ContentType.ELEMENT)
    if (!title && !subtitle && !imgUrl) {
      // TODO throw an exception when CsvExport is fixed (@see IgnoreFallbackDecorator)
      console.error(`Element '${id}' should have title, subtitle or image URL`)
    }
    this.name = title || ''
  }

  validate(): string | undefined {
    return Content.validateContents(this.buttons)
  }

  cloneWithButtons(buttons: Button[]): this {
    const clone = shallowClone(this)
    ;(clone as any).buttons = buttons
    return clone
  }
}

export class Image extends MessageContent {
  constructor(readonly common: CommonFields, readonly imgUrl: string) {
    super(common, ContentType.IMAGE)
  }
}

export class Text extends MessageContent {
  constructor(
    readonly common: CommonFields,
    // Full text
    readonly text: string,
    readonly buttons: Button[],
    readonly buttonsStyle = ButtonStyle.BUTTON
  ) {
    super(common, ContentType.TEXT)
  }

  validate(): string | undefined {
    return Content.validateContents(this.buttons)
  }

  cloneWithButtons(buttons: Button[]): this {
    const clone = shallowClone(this)
    ;(clone as any).buttons = buttons
    return clone
  }

  cloneWithText(newText: string): this {
    const clone = shallowClone(this)
    ;(clone as any).text = newText
    return clone
  }
}

export type Chitchat = Text
export const Chitchat = Text

export class Url extends TopContent {
  constructor(readonly common: CommonFields, readonly url: string) {
    super(common, ContentType.URL)
  }
}

export class Queue extends TopContent {
  constructor(
    readonly common: CommonFields,
    readonly queue: string,
    readonly schedule?: time.Schedule
  ) {
    super(common, ContentType.QUEUE)
  }
}

export class DateRangeContent extends TopContent {
  constructor(
    readonly common: CommonFields,
    readonly dateRange: time.DateRange
  ) {
    super(common, ContentType.DATE_RANGE)
  }
}

export class ScheduleContent extends TopContent {
  constructor(readonly common: CommonFields, readonly schedule: time.Schedule) {
    super(common, ContentType.SCHEDULE)
  }
}

/**
 * A {@link Content} which is automatically displayed after another one
 */
export type FollowUp = MessageContent
