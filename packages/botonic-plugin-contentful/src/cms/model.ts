import { Callback } from './cms';

/** Part of a carousel */
export class Element {
  buttons: Button[] = [];

  constructor(
    readonly title?: string,
    readonly subtitle?: string,
    readonly imgUrl?: string
  ) {
    this.subtitle = subtitle;
    this.imgUrl = imgUrl;
  }

  addButton(button: Button): Element {
    this.buttons = this.buttons.concat(button);
    return this;
  }
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
  constructor(readonly text: string, readonly buttons: Button[]) {
    super();
  }
}

export class Url extends Model {
  constructor(readonly url: string) {
    super();
  }
}
