import { Callback, ContentCallback } from './callback';
import { ModelType } from './cms';
import { Schedule } from '../time';

export enum ButtonStyle {
  BUTTON = 0,
  QUICK_REPLY = 1
}

/** Not a Content because it cannot have custom fields */
export class Asset {
  /**
   * @param type eg. image/jpeg
   * @param details depends on the type. eg the image size
   */
  constructor(
    readonly name: string,
    readonly url: string,
    readonly type?: string,
    readonly details?: any
  ) {}
}

export abstract class Content {
  /**
   * An ID (eg. PRE_FAQ1)
   * @param name TODO rename to id or code?
   */
  protected constructor(readonly name: string) {}
}

/**
 * When any {@link keywords} is detected on a user input, we can use display the {@link shortText} for users
 * to confirm their interest on this content
 */
export interface ContentWithKeywords {
  readonly name: string;
  readonly shortText?: string;
  readonly keywords?: string[];
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

export class CallbackToContentWithKeywords {
  static CHITCHAT_SHORT_TEXT = 'chitchat';
  constructor(
    /**
     * It may be a {@link Callback}'s with an URL instead of payload
     */
    readonly callback: Callback,
    /** It does not contain all the content fields. Do not downcast */
    readonly content: ContentWithKeywords
  ) {}

  toButton(): Button {
    let shortText = this.content.shortText;
    if (!shortText) {
      shortText = this.content.name;
      console.error(
        `${JSON.stringify(this.callback)} ${
          this.content.name
        } without shortText. Assigning name to button text`
      );
    }
    return new Button(this.content.name, shortText, this.callback);
  }

  getCallbackIfContentIs(modelType: ModelType): ContentCallback | undefined {
    if (
      this.callback instanceof ContentCallback &&
      this.callback.model === modelType
    ) {
      return this.callback;
    }
    return undefined;
  }

  getCallbackIfChitchat(): ContentCallback | undefined {
    if (!(this.callback instanceof ContentCallback)) {
      return undefined;
    }
    if (
      this.content.shortText !==
      CallbackToContentWithKeywords.CHITCHAT_SHORT_TEXT
    ) {
      return undefined;
    }
    return this.callback;
  }
}

export class Carousel extends Content implements ContentWithKeywords {
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

export class Image extends Content {
  constructor(readonly name: string, readonly imgUrl: string) {
    super(name);
  }
}

export class Text extends Content implements ContentWithKeywords {
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

  cloneWithButtons(buttons: Button[]): Text {
    const clone = Object.create(this);
    clone.buttons = buttons;
    return clone as Text;
  }
}

export type Chitchat = Text;

export class Url extends Content implements ContentWithKeywords {
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

export class Queue extends Content implements ContentWithKeywords {
  constructor(
    readonly name: string,
    readonly shortText?: string,
    readonly keywords: string[] = [],
    readonly schedule?: Schedule
  ) {
    super(name);
  }
}

/**
 * A {@link Content} which is automatically displayed after another one
 */
export type FollowUp = Text | Carousel | Image;
