import {
  Button,
  ButtonStyle,
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

export class RndButtonsBuilder {
  name = rndStr()
  buttons: Button[] = []

  build(): Button[] {
    return this.buttons
  }

  withButton(): RndButtonsBuilder {
    this.buttons.push(
      new Button(
        rndStr(),
        rndStr(),
        new ContentCallback(ModelType.TEXT, rndStr())
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
  readonly buttonsBuilder = new RndButtonsBuilder()
  readonly keywordsBuilder = new RndKeywordsBuilder()

  constructor(name: string = rndStr(), text: string = rndStr()) {
    super(rndStr(), name, text)
  }

  withRandomFields(): RndTextBuilder {
    this.buttons = this.buttonsBuilder
      .withButton()
      .withButton()
      .build()
    this.shortText = rndStr()
    this.keywords = this.keywordsBuilder.build()
    this.followUp = rndBool()
      ? undefined
      : new Text(new CommonFields(rndStr(), rndStr()), rndStr(), [])
    this.buttonsStyle = rndBool() ? ButtonStyle.QUICK_REPLY : ButtonStyle.BUTTON
    return this
  }
}
