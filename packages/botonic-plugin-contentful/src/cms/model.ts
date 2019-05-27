import { ButtonStyle, Callback, ContentCallback, ModelType } from './cms';

/** Part of a carousel */
export class Element {
  constructor(
    readonly buttons: Button[],
    readonly title?: string,
    readonly subtitle?: string,
    readonly imgUrl?: string
  ) {}
}

// TODO rename to Content?
export abstract class Model {
  /**
   * An ID (eg. PRE_FAQ1)
   * @param name TODO rename to id or code?
   */
  protected constructor(readonly name: string) {}
}

export class Button extends Model {
  constructor(
    readonly name: string,
    readonly text: string,
    readonly callback: Callback
  ) {
    super(name);
  }
}
export class ContentWithKeywords extends Model {
  constructor(
    readonly callback: ContentCallback,
    readonly name: string,
    // Useful to display in buttons or reports
    readonly shortText?: string,
    readonly keywords: string[] = []
  ) {
    super(name);
  }

  toButton(): Button {
    let shortText = this.shortText;
    if (!shortText) {
      shortText = this.name;
      console.error(
        `${this.callback.model} ${
          this.name
        } without shortText. Assigning name to button text`
      );
    }
    return new Button(this.name, shortText, this.callback);
  }
}

export class Carousel extends Model {
  constructor(
    readonly name: string, // Useful to display in buttons or reports
    readonly elements: Element[] = [],
    readonly shortText?: string,
    readonly keywords: string[] = []
  ) {
    super(name);
  }

  contentType(): ModelType {
    return ModelType.CAROUSEL;
  }
}

export class Text extends Model {
  constructor(
    // An ID (eg. PRE_FAQ1)
    readonly name: string,
    // Full text
    readonly text: string,
    readonly buttons: Button[],
    // Useful to display in buttons or reports
    readonly shortText?: string,
    readonly keywords: string[] = [],
    readonly followUp?: FollowUp,
    readonly buttonsStyle = ButtonStyle.BUTTON
  ) {
    super(name);
  }

  contentType(): ModelType {
    return ModelType.TEXT;
  }

  /** Useful to hide a button (eg. when Desk queue is closed) */
  cloneWithFilteredButtons(onlyKeep: (b: Button) => boolean): Text {
    const clone: any = { ...this };
    clone.buttons = clone.buttons.filter(onlyKeep);
    return clone as Text;
  }
}

export class Url extends Model {
  //TODO followUp not yet rendered
  constructor(readonly url: string, readonly followup?: FollowUp) {
    super(url);
  }
}

/**
 * A {@link Model} which is automatically displayed after another one
 */
export type FollowUp = Text | Carousel;
