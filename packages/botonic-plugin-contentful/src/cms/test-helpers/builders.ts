import {
  Button,
  ButtonStyle,
  Callback,
  CommonFields,
  ContentCallback,
  ModelType,
  Text,
} from '../index'
import { TextBuilder } from '../factories'

export function rndStr(): string {
  return Math.random().toString()
}

export function rndBool(): boolean {
  return Math.random() >= 0.5
}

export class ContentCallbackBuilder {
  callback: ContentCallback | undefined
  modelType: ModelType | undefined
  contentId = rndStr()

  withModelType(modelType: ModelType): ContentCallbackBuilder {
    this.modelType = modelType
    return this
  }

  withContentId(contentId: string): ContentCallbackBuilder {
    this.contentId = contentId
    return this
  }

  build(): ContentCallback {
    return new ContentCallback(
      this.modelType || ModelType.TEXT,
      this.contentId || rndStr()
    )
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

  withCallback(callback: Callback): RndButtonsBuilder {
    this.callback = callback
    return this
  }

  addButton(): RndButtonsBuilder {
    this.buttons.push(
      new Button(
        this.name || rndStr(),
        this.text || rndStr(),
        this.callback || this.callbackBuilder.build()
      )
    )
    return this
  }
}

export class RndKeywordsBuilder {
  keywords = [rndStr(), rndStr()]

  build(): string[] {
    return this.keywords
  }
}

export class RndTextBuilder extends TextBuilder {
  private buttonsBuilder: RndButtonsBuilder | undefined
  readonly keywordsBuilder = new RndKeywordsBuilder()

  constructor(name: string = rndStr(), text: string = rndStr()) {
    super(rndStr(), name, text)
  }

  withButtonsBuilder(): RndButtonsBuilder {
    this.buttonsBuilder = new RndButtonsBuilder()
    return this.buttonsBuilder
  }

  build(): Text {
    if (this.buttonsBuilder) {
      this.buttons = this.buttonsBuilder.build()
    }
    return super.build()
  }

  withRandomFields(): RndTextBuilder {
    if (!this.buttonsBuilder) {
      this.buttonsBuilder = new RndButtonsBuilder().addButton().addButton()
    }
    this.shortText = rndStr()
    this.keywords = this.keywordsBuilder.build()
    this.followUp = rndBool()
      ? undefined
      : new Text(new CommonFields(rndStr(), rndStr()), rndStr(), [])
    this.buttonsStyle = rndBool() ? ButtonStyle.QUICK_REPLY : ButtonStyle.BUTTON
    return this
  }
}
