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

export abstract class Model {}

export class Button extends Model {
  constructor(readonly text: string, readonly callback: Callback) {
    super();
  }
}

export class Carousel extends Model {
  constructor(readonly elements: Element[] = []) {
    super();
  }
}

export class Text extends Model {
  constructor(
    readonly text: string,
    readonly buttons: Button[],
    readonly followup?: Text | Carousel
  ) {
    super();
  }
}

export class Url extends Model {
  constructor(readonly url: string) {
    super();
  }
}
