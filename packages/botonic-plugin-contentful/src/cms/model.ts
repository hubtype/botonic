import { Callback } from './cms';

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

export class Carousel extends Model {
  constructor(readonly name: string, readonly elements: Element[] = []) {
    super(name);
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
    readonly followup?: FollowUp
  ) {
    super(name);
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
