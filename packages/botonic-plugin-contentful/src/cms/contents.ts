import * as time from '../time'
import { Callback } from './callback'
import { SearchableBy } from './fields'
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
  /** @return message if any issue detected */
  validate(): string | undefined {
    return undefined
  }

  static validateContents(contents: Content[]): string | undefined {
    const invalids = contents.map(c => c.validate()).filter(v => v)
    if (invalids.length == 0) {
      return undefined
    }
    return invalids.join('. ')
  }
}

/**
 * A self-contained content to which {@link Callback} may refer
 */
export abstract class TopContent extends Content {
  protected constructor(readonly common: CommonFields) {
    super()
  }

  cloneWithFollowUp(newFollowUp: FollowUp): TopContent {
    const clone = shallowClone(this)
    ;(clone as any).common = shallowClone(clone.common)
    ;(clone as any).common.followUp = newFollowUp
    return clone
  }
}

/**
 * When any {@link keywords} is detected on a user input, we can use display the {@link shortText} for users
 * to confirm their interest on this content
 */
export class CommonFields {
  readonly shortText?: string
  readonly keywords: string[]
  readonly searchableBy?: SearchableBy
  /** Useful when contents need to be replicated according to some criteria. Eg. country, company,...
   */
  readonly partitions: string[]
  readonly dateRange?: DateRangeContent
  followUp?: FollowUp
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
      this.shortText = opt.shortText
      this.keywords = opt.keywords || []
      this.searchableBy = opt.searchableBy
      this.partitions = opt.partitions || []
      this.dateRange = opt.dateRange
      this.followUp = opt.followUp
    } else {
      this.keywords = []
      this.partitions = []
    }
  }
}

export class Button extends Content {
  constructor(
    readonly name: string,
    readonly text: string,
    readonly callback: Callback
  ) {
    super()
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
}

export class StartUp extends TopContent {
  constructor(
    readonly common: CommonFields,
    readonly imgUrl: string | undefined,
    readonly text: string | undefined,
    readonly buttons: Button[]
  ) {
    super(common)
  }

  validate(): string | undefined {
    return Content.validateContents(this.buttons)
  }
}

export class Carousel extends TopContent {
  constructor(
    readonly common: CommonFields,
    readonly elements: Element[] = []
  ) {
    super(common)
  }

  validate(): string | undefined {
    return Content.validateContents(this.elements)
  }
}

/** Part of a carousel */
export class Element extends Content {
  readonly name: string
  constructor(
    readonly buttons: Button[],
    readonly title?: string,
    readonly subtitle?: string,
    readonly imgUrl?: string
  ) {
    super()
    this.name = title || ''
  }

  validate(): string | undefined {
    return Content.validateContents(this.buttons)
  }
}

export class Image extends TopContent {
  constructor(readonly common: CommonFields, readonly imgUrl: string) {
    super(common)
  }
}

export class Text extends TopContent {
  constructor(
    readonly common: CommonFields,
    // Full text
    readonly text: string,
    readonly buttons: Button[],
    readonly buttonsStyle = ButtonStyle.BUTTON
  ) {
    super(common)
  }

  validate(): string | undefined {
    return Content.validateContents(this.buttons)
  }

  cloneWithButtons(buttons: Button[]): Text {
    const clone = shallowClone(this)
    ;(clone as any).buttons = buttons
    return clone as Text
  }

  cloneWithText(newText: string): Text {
    const clone = shallowClone(this)
    ;(clone as any).text = newText
    return clone
  }
}

export type Chitchat = Text

export class Url extends TopContent {
  constructor(readonly common: CommonFields, readonly url: string) {
    super(common)
  }
}

export class Queue extends TopContent {
  constructor(
    readonly common: CommonFields,
    readonly queue: string,
    readonly schedule?: time.Schedule
  ) {
    super(common)
  }
}

export class DateRangeContent extends TopContent {
  constructor(
    readonly common: CommonFields,
    readonly dateRange: time.DateRange
  ) {
    super(common)
  }
}

export class ScheduleContent extends TopContent {
  constructor(readonly common: CommonFields, readonly schedule: time.Schedule) {
    super(common)
  }
}

/**
 * A {@link Content} which is automatically displayed after another one
 */
export type FollowUp = Text | Carousel | Image | StartUp
