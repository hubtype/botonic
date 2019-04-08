interface RichMessage {
  title?: string;
  subtitle?: string;
  imgURL?: string;

  button?: Button;
}

interface Button {
  text: string;

  url?: string;
  payload?: string;
}

interface Carousel {
  elements: RichMessage[];
}
