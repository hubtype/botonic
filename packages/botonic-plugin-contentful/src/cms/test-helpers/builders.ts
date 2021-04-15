import { ContentType } from '../cms'
import {
  CarouselBuilder,
  DocumentBuilder,
  ElementBuilder,
  ImageBuilder,
  StartUpBuilder,
  TextBuilder,
  TopContentBuilder,
} from '../factories/content-factories'
import {
  Button,
  ButtonStyle,
  Callback,
  CmsException,
  CommonFields,
  ContentCallback,
  Element,
  Text,
  TopContentId,
} from '../index'

export function rndStr(): string {
  return Math.random().toString()
}

export function rndBool(): boolean {
  return Math.random() >= 0.5
}

export class ContentCallbackBuilder {
  callback: Callback | undefined

  withContentId(contentId: TopContentId): ContentCallbackBuilder {
    this.callback = ContentCallback.ofContentId(contentId)
    return this
  }

  build(): Callback {
    return this.callback || new ContentCallback(ContentType.TEXT, rndStr())
  }
}

export class RndButtonsBuilder {
  name: string | undefined
  text: string | undefined
  buttons: Button[] = []
  callbackBuilder = new ContentCallbackBuilder()
  callback: Callback | undefined

  build(): Button[] {
    return this.buttons
  }

  withCallback(callback: Callback): this {
    this.callback = callback
    return this
  }

  withName(name: string): this {
    this.name = name
    return this
  }

  withText(text: string): this {
    this.text = text
    return this
  }

  addButton(): this {
    this.buttons.push(
      new Button(
        rndStr(),
        this.name ?? rndStr(),
        this.text ?? rndStr(),
        this.callback ?? this.callbackBuilder.build()
      )
    )
    return this
  }
}

export class RndTopContentBuilder {
  keywords = []

  withRandomFields(builder: TopContentBuilder) {
    builder.shortText = rndStr()
    builder.keywords = [rndStr(), rndStr()]
    builder.followUp = rndBool()
      ? undefined
      : new Text(new CommonFields(rndStr(), rndStr()), rndStr(), [])
  }
}

export class RndTextBuilder extends TextBuilder {
  public buttonsBuilder = new RndButtonsBuilder()
  readonly topComponentBuilder = new RndTopContentBuilder()

  constructor(name: string = rndStr(), text: string = rndStr()) {
    super(rndStr(), name, text)
  }

  /** @deprecated use buttonsBuilder */
  withButtonsBuilder(): RndButtonsBuilder {
    return this.buttonsBuilder
  }

  build(): Text {
    const buttons = this.buttonsBuilder.build()
    // TODO too complex. resurrect withButtonsBuilder?
    if (buttons.length > 0) {
      if (this.buttons.length > 0) {
        throw new CmsException(
          'Not supported to add buttons with both .buttons & buttonsBuilder'
        )
      }
      this.buttonsBuilder.buttons = []
      this.buttons = buttons
    }
    return super.build()
  }

  withRandomFields(): this {
    this.buttonsBuilder.addButton().addButton()
    this.topComponentBuilder.withRandomFields(this)
    this.buttonsStyle = rndBool() ? ButtonStyle.QUICK_REPLY : ButtonStyle.BUTTON
    return this
  }
}

export class RndElementBuilder extends ElementBuilder {
  // move ButtonsBuilder to ElementBuilder?
  private buttonsBuilder: RndButtonsBuilder | undefined

  constructor() {
    super(rndStr())
  }

  withButtonsBuilder(): RndButtonsBuilder {
    if (this.buttons.length > 0) {
      throw new CmsException(
        'cannot use withButtonsBuilder if addButtons was previously called'
      )
    }
    if (!this.buttonsBuilder) {
      this.buttonsBuilder = new RndButtonsBuilder()
    }
    return this.buttonsBuilder
  }

  withButtons(buttons: Button[]): this {
    if (this.buttonsBuilder) {
      throw new CmsException(
        'cannot use addButtons if withButtonsBuilder was previously called'
      )
    }
    return super.withButtons(buttons)
  }

  withRandomFields(): this {
    if (!this.buttonsBuilder) {
      this.buttonsBuilder = new RndButtonsBuilder().addButton().addButton()
    }
    this.title = rndStr()
    this.subtitle = rndStr()
    this.imgUrl = rndStr()
    return this
  }

  build(): Element {
    if (this.buttonsBuilder) {
      this.buttons = this.buttonsBuilder.build()
    }
    return super.build()
  }
}

export class RndCarouselBuilder extends CarouselBuilder {
  readonly topComponentBuilder = new RndTopContentBuilder()
  readonly elementBuilder = new RndElementBuilder()

  constructor(name: string = rndStr()) {
    super(rndStr(), name)
  }

  withRandomFields(numElements = 2): this {
    for (let i = 0; i < numElements; i++) {
      this.elementBuilder.withRandomFields()
      this.addElement()
    }
    this.topComponentBuilder.withRandomFields(this)
    return this
  }
}

export class RndStartUpBuilder extends StartUpBuilder {
  readonly topComponentBuilder = new RndTopContentBuilder()
  readonly buttonsBuilder = new RndButtonsBuilder()

  constructor(name: string = rndStr(), text: string = rndStr()) {
    super(rndStr(), name, text)
  }

  withRandomFields(): this {
    this.buttons = this.buttonsBuilder.addButton().addButton().build()

    this.topComponentBuilder.withRandomFields(this)
    return this
  }
}

export class RndImageBuilder extends ImageBuilder {
  readonly topComponentBuilder = new RndTopContentBuilder()

  constructor(name: string = rndStr(), imgUrl: string = 'http://' + rndStr()) {
    super(rndStr(), name, imgUrl)
  }

  withRandomFields(): this {
    this.topComponentBuilder.withRandomFields(this)
    return this
  }
}

export class RndDocumentBuilder extends DocumentBuilder {
  readonly topComponentBuilder = new RndTopContentBuilder()

  constructor(name: string = rndStr(), docUrl: string = 'http://' + rndStr()) {
    super(rndStr(), name, docUrl)
  }

  withRandomFields(): this {
    this.topComponentBuilder.withRandomFields(this)
    return this
  }
}
