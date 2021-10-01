export interface CommonFields {
  id: string
  name: string
  shortText?: string
  keywords?: string[]
  followup?: Text | Image
  customFields?: Record<string, unknown>
}

export interface AssetInfo {
  readonly name: string
  readonly fileName?: string
  readonly type?: string
  readonly description?: string
}

export abstract class Content {
  readonly common: CommonFields
  constructor(common: CommonFields) {
    this.common = common
  }
  get name(): string {
    return this.common.name
  }

  get id(): string {
    return this.common.id
  }
}

export class Text extends Content {
  readonly text: string
  readonly buttons?: Button[]
  constructor(opt: { common: CommonFields; text: string; buttons?: Button[] }) {
    super(opt.common)
    this.text = opt.text
    this.buttons = opt.buttons
  }
}

export class Button extends Content {
  readonly text: string
  readonly target: string
  constructor(opt: { common: CommonFields; text: string; target: string }) {
    super(opt.common)
    this.text = opt.text
    this.target = opt.target
  }
}

export class Image extends Content {
  readonly image: string
  constructor(opt: { common: CommonFields; image: string }) {
    super(opt.common)
    this.image = opt.image
  }
}
