import * as cms from '../cms';
import { ButtonStyle } from '../cms';

export class RenderOptions {
  followUpDelaySeconds = 4;
  maxButtons = 3;
  maxQuickReplies = 5;
}

export interface BotonicMsg {
  type: 'carousel' | 'text' | 'image';
  delay?: number;
  data: any;
}

export class BotonicMsgConverter {
  constructor(readonly options = new RenderOptions()) {}

  carousel(carousel: cms.Carousel, delayS: number = 0): BotonicMsg {
    return {
      type: 'carousel',
      delay: delayS,
      data: {
        elements: carousel.elements.map(e => this.element(e))
      }
    };
  }

  private element(cmsElement: cms.Element): any {
    return {
      img: cmsElement.imgUrl,
      title: cmsElement.title,
      subtitle: cmsElement.subtitle,
      buttons: this.convertButtons(cmsElement.buttons, ButtonStyle.BUTTON)
    };
  }

  private convertButtons(cmsButtons: cms.Button[], style: ButtonStyle): any[] {
    const maxButtons =
      style == ButtonStyle.BUTTON
        ? this.options.maxButtons
        : this.options.maxQuickReplies;
    cmsButtons = cmsButtons.slice(0, maxButtons);
    return cmsButtons.map(cmsButton => {
      const msgButton = {
        payload: cmsButton.callback.payload,
        url: cmsButton.callback.url
      } as any;
      if (style == ButtonStyle.BUTTON) {
        msgButton['title'] = cmsButton.text;
      } else {
        msgButton['text'] = cmsButton.text;
      }
      return msgButton;
    });
  }

  text(text: cms.Text, delayS: number = 0): BotonicMsg | BotonicMsg[] {
    const msg: any = {
      type: 'text',
      delay: delayS,
      data: { text: text.text }
    };
    const buttons = this.convertButtons(text.buttons, text.buttonsStyle);
    if (text.buttonsStyle == ButtonStyle.QUICK_REPLY) {
      msg['replies'] = buttons;
    } else {
      msg['buttons'] = buttons;
    }
    if (text.followUp) {
      return [msg, this.followUp(text.followUp)];
    }
    return msg;
  }

  image(img: cms.Image): BotonicMsg {
    return {
      type: 'image',
      data: {
        image: img.imgUrl
      }
    };
  }

  private followUp(followUp: cms.FollowUp): BotonicMsg | BotonicMsg[] {
    if (followUp instanceof cms.Text) {
      // give user time to read the initial text
      return this.text(followUp, this.options.followUpDelaySeconds);
    } else if (followUp instanceof cms.Carousel) {
      // for carousels, the previous text usually introduces the carousel. So, we set a smaller delay
      return this.carousel(followUp, 2);
    } else if (followUp instanceof cms.Image) {
      return this.image(followUp);
    } else {
      throw new Error('Unexpected followUp type ' + typeof followUp);
    }
  }
}
