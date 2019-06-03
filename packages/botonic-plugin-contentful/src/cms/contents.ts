import { Callback, ContentCallback } from './callback';

export enum ButtonStyle {
  BUTTON = 0,
  QUICK_REPLY = 1
}

export abstract class Content {
  /**
   * An ID (eg. PRE_FAQ1)
   * @param name TODO rename to id or code?
   */
  protected constructor(readonly name: string) {}
}

export class Button extends Content {
  constructor(
    readonly name: string,
    readonly text: string,
    readonly callback: Callback
  ) {
    super(name);
  }
}

export class ContentCallbackWithKeywords extends Content {
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

export class Carousel extends Content {
  constructor(
    readonly name: string, // Useful to display in buttons or reports
    readonly elements: Element[] = [],
    readonly shortText?: string,
    readonly keywords: string[] = []
  ) {
    super(name);
  }
}

/** Part of a carousel */
export class Element {
  constructor(
    readonly buttons: Button[],
    readonly title?: string,
    readonly subtitle?: string,
    readonly imgUrl?: string
  ) {}
}

export class Text extends Content {
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

  /** Useful to hide a button (eg. when Desk queue is closed) */
  cloneWithFilteredButtons(onlyKeep: (b: Button) => boolean): Text {
    const clone: any = { ...this };
    clone.buttons = clone.buttons.filter(onlyKeep);
    return clone as Text;
  }
}

export class Url extends Content {
  //TODO followUp not yet rendered
  constructor(
    readonly name: string,
    readonly url: string,
    readonly shortText?: string,
    readonly keywords: string[] = [],
    readonly followup?: FollowUp
  ) {
    super(name);
  }
}

/**
 * A {@link Content} which is automatically displayed after another one
 */
export type FollowUp = Text | Carousel;
