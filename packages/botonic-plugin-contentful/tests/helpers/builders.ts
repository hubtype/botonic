import {
  Button,
  ButtonStyle,
  ContentCallback,
  FollowUp,
  Model,
  ModelType,
  Text
} from '../../src/cms';

function rndStr(): string {
  return Math.random().toString();
}

function rndBool(): boolean {
  return Math.random() >= 0.5;
}

abstract class ModelBuilder {
  name: string = rndStr();

  withName(name: string): ModelBuilder {
    this.name = name;
    return this;
  }
  abstract build(): Model;
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

export class TextBuilder extends ModelBuilder {
  text = rndStr();
  readonly buttons = new ButtonsBuilder();
  shortText = rndStr();
  readonly keywords = new KeywordsBuilder();

  build(): Text {
    return new Text(
      this.name,
      this.text,
      this.buttons.build(),
      this.shortText,
      this.keywords.build(),
      // TODO add follow up but avoid too many recursive texts
      undefined,
      rndBool() ? ButtonStyle.BUTTON : ButtonStyle.QUICK_REPLY
    );
  }
}
