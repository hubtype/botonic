import {
  Button,
  ButtonStyle,
  ContentCallback,
  ModelType,
  Text
} from '../../src/cms';
import { TextBuilder } from '../../src/cms/factories';

function rndStr(): string {
  return Math.random().toString();
}

function rndBool(): boolean {
  return Math.random() >= 0.5;
}

export class ButtonsBuilder {
  name = rndStr();
  buttons: Button[] = [];

  build(): Button[] {
    return this.buttons;
  }

  withButton(): ButtonsBuilder {
    this.buttons.push(
      new Button(
        rndStr(),
        rndStr(),
        new ContentCallback(ModelType.TEXT, rndStr())
      )
    );
    return this;
  }
}

export class KeywordsBuilder {
  keywords = [rndStr(), rndStr()];

  build(): string[] {
    return this.keywords;
  }
}

export class RndTextBuilder extends TextBuilder {
  readonly buttonsBuilder = new ButtonsBuilder();
  readonly keywordsBuilder = new KeywordsBuilder();

  constructor(name: string = rndStr(), text: string = rndStr()) {
    super(name, text);
    this.buttons = this.buttonsBuilder
      .withButton()
      .withButton()
      .build();
    this.shortText = rndStr();
    this.keywords = this.keywordsBuilder.build();
    this.followUp = rndBool() ? undefined : new Text(rndStr(), rndStr(), []);
    this.buttonsStyle = rndBool()
      ? ButtonStyle.QUICK_REPLY
      : ButtonStyle.BUTTON;
  }
}
