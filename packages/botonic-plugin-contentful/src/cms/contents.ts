import { Schedule } from '../time';
import { Callback } from './callback';
import { SearchableBy } from './fields';

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

/**
 * Any content deliverable from a CMS
 */
export abstract class Content {
  /** @return message if any issue detected */
  validate(): string | undefined {
    return undefined;
  }

  static validateContents(contents: Content[]): string | undefined {
    const invalids = contents.map(c => c.validate()).filter(v => v);
    if (invalids.length == 0) {
      return undefined;
    }
    return invalids.join('. ');
  }
}

/**
 * When any {@link keywords} is detected on a user input, we can use display the {@link shortText} for users
 * to confirm their interest on this content
 */
export class CommonFields {
  readonly shortText?: string;
  readonly keywords?: string[];
  readonly searchableBy?: SearchableBy;
  constructor(
    readonly name: string,
    opt?: {
      shortText?: string;
      keywords?: string[];
      searchableBy?: SearchableBy;
    }
  ) {
    if (opt) {
      this.shortText = opt.shortText;
      this.keywords = opt.keywords;
      this.searchableBy = opt.searchableBy;
    }
  }
}

export class Button extends Content {
  constructor(
    readonly name: string,
    readonly text: string,
    readonly callback: Callback
  ) {
    super();
  }

  validate(): string | undefined {
    if (!this.text) {
      return `Button '${this.name}' without text`;
    }
    if (!this.name) {
      return `Button with text '${this.text}' without name`;
    }
    return undefined;
  }
}

export class StartUp extends Content {
  constructor(
    readonly common: CommonFields,
    readonly imgUrl: string | undefined,
    readonly text: string | undefined,
    readonly buttons: Button[]
  ) {
    super();
  }

  validate(): string | undefined {
    return Content.validateContents(this.buttons);
  }
}

export class Carousel extends Content {
  constructor(
    readonly common: CommonFields,
    readonly elements: Element[] = []
  ) {
    super();
  }

  validate(): string | undefined {
    return Content.validateContents(this.elements);
  }
}

/** Part of a carousel */
export class Element extends Content {
  readonly name: string;
  constructor(
    readonly buttons: Button[],
    readonly title?: string,
    readonly subtitle?: string,
    readonly imgUrl?: string
  ) {
    super();
    this.name = title || '';
  }

  validate(): string | undefined {
    return Content.validateContents(this.buttons);
  }
}

export class Image extends Content {
  constructor(readonly name: string, readonly imgUrl: string) {
    super();
  }
}

export class Text extends Content {
  constructor(
    readonly common: CommonFields,
    // Full text
    readonly text: string,
    readonly buttons: Button[],
    readonly followUp?: FollowUp,
    readonly buttonsStyle = ButtonStyle.BUTTON
  ) {
    super();
  }

  validate(): string | undefined {
    return Content.validateContents(this.buttons);
  }

  cloneWithButtons(buttons: Button[]): Text {
    const clone = Object.create(this);
    clone.buttons = buttons;
    return clone as Text;
  }

  cloneWithText(newText: string): Text {
    const clone = Object.create(this);
    clone.text = newText;
    return clone as Text;
  }

  cloneWithFollowUp(newFollowUp: FollowUp): Text {
    const clone = Object.create(this);
    clone.followUp = newFollowUp;
    return clone as Text;
  }
}

export type Chitchat = Text;

export class Url extends Content {
  /**
   *
   * @param followup so far not defined in Contentful model, since URL's are not rendered anyway
   */
  constructor(
    readonly common: CommonFields,
    readonly url: string,
    readonly followup?: FollowUp
  ) {
    super();
  }
}

export class Queue extends Content {
  constructor(
    readonly common: CommonFields,
    readonly queue: string,
    readonly schedule?: Schedule
  ) {
    super();
  }
}

/**
 * A {@link Content} which is automatically displayed after another one
 */
export type FollowUp = Text | Carousel | Image;
