import { Callback } from './callback'
import { ContentType } from './cms'
import * as time from '../time'

export enum ButtonStyle {
  BUTTON = 0,
  QUICK_REPLY = 1,
}

export interface CommonFields {
  id: string
  name: string
  shortText?: string
  keywords?: string[]
  followUp?: Text | Image | Carousel
  customFields?: Record<string, unknown>
}

export interface AssetInfo {
  readonly name?: string
  readonly fileName?: string
  readonly type?: string
  readonly description?: string
}

export class ContentId {
  readonly model: ContentType
  readonly id: string
  constructor(model: ContentType, id: string) {
    this.model = model
    this.id = id
  }
}

export abstract class Content {
  readonly common: CommonFields
  readonly contentType: ContentType
  constructor(common: CommonFields, contentType: ContentType) {
    this.common = common
    this.contentType = contentType
  }
  get name(): string {
    return this.common.name
  }

  get id(): string {
    return this.common.id
  }
  get contentId(): ContentId {
    return new ContentId(this.contentType, this.id)
  }
}

export class Url extends Content {
  readonly url: string
  constructor(opt: { common: CommonFields; url: string }) {
    super(opt.common, ContentType.URL)
    this.url = opt.url
  }
}

export class Payload extends Content {
  readonly payload: string
  constructor(opt: { common: CommonFields; payload: string }) {
    super(opt.common, ContentType.PAYLOAD)
    this.payload = opt.payload
  }
}

export class Text extends Content {
  readonly text: string
  readonly buttons: Button[]
  readonly buttonsStyle?: ButtonStyle
  constructor(opt: {
    common: CommonFields
    text: string
    buttons: Button[]
    buttonsStyle?: ButtonStyle
  }) {
    super(opt.common, ContentType.TEXT)
    this.text = opt.text
    this.buttons = opt.buttons
    this.buttonsStyle = opt.buttonsStyle
  }
}

export class Button extends Content {
  readonly text: string
  readonly callback: Callback
  constructor(opt: { common: CommonFields; text: string; callback: Callback }) {
    super(opt.common, ContentType.BUTTON)
    this.text = opt.text
    this.callback = opt.callback
  }
}

export class Image extends Content {
  readonly imgUrl: string
  constructor(opt: { common: CommonFields; imgUrl: string }) {
    super(opt.common, ContentType.IMAGE)
    this.imgUrl = opt.imgUrl
  }
}

export class Element extends Content {
  readonly title: string
  readonly subtitle: string
  readonly buttons: Button[]
  readonly imgUrl: string
  constructor(opt: {
    common: CommonFields
    title: string
    subtitle: string
    buttons: Button[]
    imgUrl: string
  }) {
    super(opt.common, ContentType.ELEMENT)
    this.title = opt.title
    this.subtitle = opt.subtitle
    this.buttons = opt.buttons
    this.imgUrl = opt.imgUrl
  }
}

export class Carousel extends Content {
  readonly elements: Element[]
  constructor(opt: { common: CommonFields; elements: Element[] }) {
    super(opt.common, ContentType.CAROUSEL)
    this.elements = opt.elements
  }
}

export class Queue extends Content {
  readonly queue: string
  readonly schedule?: time.Schedule
  constructor(opt: {
    common: CommonFields
    queue: string
    schedule: time.Schedule
  }) {
    super(opt.common, ContentType.QUEUE)
    this.queue = opt.queue
    this.schedule = opt.schedule
  }
}

export class DateRangeContent extends Content {
  constructor(
    readonly common: CommonFields,
    readonly dateRange: time.DateRange
  ) {
    super(common, ContentType.DATE_RANGE)
  }
}

export class ScheduleContent extends Content {
  readonly schedule: time.Schedule
  constructor(opt: { common: CommonFields; schedule: time.Schedule }) {
    super(opt.common, ContentType.SCHEDULE)
    this.schedule = opt.schedule
  }
}

export type OnFinish = Callback | undefined

export class HandoffAgentEmail {
  readonly type = 'AGENT_EMAIL'
  constructor(readonly agentEmail: string) {}
}

export class HandoffAgentId {
  readonly type = 'AGENT_ID'
  constructor(readonly agentId: string) {}
}

export type HandoffAgent = HandoffAgentEmail | HandoffAgentId

export class Handoff extends Content {
  readonly onFinish: OnFinish
  readonly message?: string
  readonly failMessage?: string
  readonly queue?: Queue
  readonly shadowing?: boolean
  constructor(opt: {
    common: CommonFields
    onFinish?: OnFinish
    message?: string
    failMessage?: string
    queue?: Queue
    shadowing?: boolean
  }) {
    super(opt.common, ContentType.HANDOFF)
    this.onFinish = opt.onFinish
    this.message = opt.message
    this.failMessage = opt.failMessage
    this.queue = opt.queue
    this.shadowing = opt.shadowing
  }
}
