import * as time from '../time'
import { shallowClone, Stringable } from '../util/objects'
import { Callback, ContentCallback, TopContentId } from './callback'
import { ContentType, MessageContentType, TopContentType } from './cms'
import { SearchableBy } from './fields'

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
    readonly id: string,
    readonly name: string,
    readonly url: string,
    readonly type?: string,
    readonly details?: any
  ) {}
}

/**
 * Any content deliverable from a CMS
 */
export abstract class Content implements Stringable {
  protected constructor(readonly contentType: ContentType) {}

  /** @return message if any issue detected */
  validate(): string | undefined {
    return undefined
  }

  abstract get id(): string

  abstract get name(): string

  toString(): string {
    return `'${this.id}/${this.name}'`
  }

  static validateContents(contents: Content[]): string | undefined {
    return this.mergeValidations(contents.map(c => c.validate()))
  }

  static mergeValidations(
    validations: (string | undefined)[]
  ): string | undefined {
    validations = validations.filter(v => v)
    if (validations.length == 0) {
      return undefined
    }
    return validations.join('. ')
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

  isSearchable(): boolean {
    return this.common.keywords.length > 0 || Boolean(this.common.searchableBy)
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

  findRecursively(
    predicate: (c: MessageContent) => boolean
  ): MessageContent | undefined {
    if (predicate(this)) {
      return this
    }
    if (!this.common.followUp) {
      return undefined
    }
    return this.common.followUp.findRecursively(predicate)
  }

  cloneWithFollowUp(newFollowUp: FollowUp | undefined): this {
    const clone = shallowClone(this)
    ;(clone as any).common = shallowClone(clone.common)
    ;(clone as any).common.followUp = newFollowUp
    return clone
  }

  cloneWithFollowUpLast(lastContent: FollowUp): this {
    if (!this.common.followUp) {
      return this.cloneWithFollowUp(lastContent)
    }
    const followUp = this.common.followUp.cloneWithFollowUpLast(lastContent)
    return this.cloneWithFollowUp(followUp)
  }

  validate(): string | undefined {
    // shortText only validated when it's searchable, since
    // it's only required so far to show text on buttons which
    // refer to this content
    if (this.isSearchable() && !this.common.shortText) {
      return `is searchable but has no shortText`
    }
    return undefined
  }
}

/**
 * When any {@link keywords} is detected on a user input, we can use display the {@link shortText} for users
 * to confirm their interest on this content
 * TODO move contentId o ContentType here?
 */
export class CommonFields implements Stringable {
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

  toString(): string {
    return `'${this.id}/${this.name}'`
  }
}

/**
 * In CMS, it's possible both to have direct references to the target content
 * opened by the button, or to have intermediate button contents which reference
 * the target and allow the button to have a text different than the target content's
 * shortText.
 */
export class Button extends Content {
  private readonly usingNameForText: boolean
  public readonly text: string

  /**
   * @param id If content having the button has a direct reference to the target
   * content instead of a Button content, the id will be the id of the target.
   * If content having the button has a reference to a Button content, id will
   * be the id of the Button content
   */
  constructor(
    readonly id: string,
    readonly name: string,
    text: string,
    readonly callback: Callback
  ) {
    super(ContentType.BUTTON)
    this.usingNameForText = !text
    this.text = text || this.name
  }

  validate(): string | undefined {
    if (this.usingNameForText) {
      return this.name
        ? `without short text. Using instead 'name' field. `
        : `without short text nor name.`
    }
    return undefined
  }

  isDirectReferenceToTarget(): boolean {
    return (
      this.callback instanceof ContentCallback && this.callback.id == this.id
    )
  }

  toString(): string {
    if (this.isDirectReferenceToTarget()) {
      return `to ${this.callback.toString()}`
    }
    return `${super.toString()} to content ${this.callback.toString()}`
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
    if (this.elements.length == 0) {
      return 'has no elements'
    }
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
    readonly buttonsStyle?: ButtonStyle
  ) {
    super(common, ContentType.TEXT)
  }

  validate(): string | undefined {
    const noText = !this.text ? `has no text` : undefined

    return Content.mergeValidations([
      noText,
      super.validate(),
      Content.validateContents(this.buttons),
    ])
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
