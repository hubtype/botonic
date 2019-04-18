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

export class Button {
  constructor(readonly text: string, readonly callback: Callback) {}
}

export class Carousel {
  constructor(readonly elements: Element[] = []) {}
}
