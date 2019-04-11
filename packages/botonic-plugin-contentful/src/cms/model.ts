import { Callback } from "./cms";

export class RichMessage {
  buttons: Button[] = [];

  constructor(readonly title?: string, readonly subtitle?: string, readonly imgUrl?: string) {
    this.subtitle = subtitle;
    this.imgUrl = imgUrl;
  }

  addButton(button: Button): RichMessage {
    this.buttons = this.buttons.concat(button);
    return this;
  }
}

// export interface Observable {
//   setUrl(url: string): Observable;
//   setPayload(payload: string) :Observable;
// } 

export class Button {
  
  constructor(readonly text: string, readonly callback: Callback) {
  }
}

export class Carousel {
  elements: RichMessage[] = [];

  addElement(element: RichMessage): Carousel {
    this.elements = this.elements.concat(element);
    return this;
  }
}
