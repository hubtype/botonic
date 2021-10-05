import { ContentType } from './cms'

export enum ButtonStyle {
  BUTTON = 0,
  QUICK_REPLY = 1,
}

export interface CommonFields {
  id: string
  name: string
  shortText?: string
  keywords?: string[]
  followUp?: Text | Image
  customFields?: Record<string, unknown>
}

export interface AssetInfo {
  readonly name: string
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
  readonly target: string
  constructor(opt: { common: CommonFields; text: string; target: string }) {
    super(opt.common, ContentType.BUTTON)
    this.text = opt.text
    this.target = opt.target
  }
}

export class Image extends Content {
  readonly imgUrl: string
  constructor(opt: { common: CommonFields; imgUrl: string }) {
    super(opt.common, ContentType.IMAGE)
    this.imgUrl = opt.imgUrl
  }
}
