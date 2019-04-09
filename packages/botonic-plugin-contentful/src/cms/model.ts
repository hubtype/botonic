export class RichMessage {
  title?: string;

  subtitle?: string;

  imgURL?: string;

  button?: Button;
}

export class Button {
  text: string;

  url?: string;

  payload?: string;
}

export class Carousel {
  elements: RichMessage[];
}
