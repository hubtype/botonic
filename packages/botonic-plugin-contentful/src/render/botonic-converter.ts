import * as cms from '../cms'
import { ButtonStyle, TopContent } from '../cms'

export class RenderOptions {
  followUpDelaySeconds = 4
  maxButtons = 3
  maxQuickReplies = 5
}

export interface BotonicMsg {
  type: 'carousel' | 'text' | 'image'
  delay?: number
  data: any
}

// https://stackoverflow.com/a/45999529/145289
export type BotonicMsgs = BotonicMsg | BotonicMsgArray
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BotonicMsgArray extends Array<BotonicMsgs> {}

export interface BotonicText extends BotonicMsg {
  buttons: any
}

export class BotonicMsgConverter {
  constructor(readonly options = new RenderOptions()) {}

  carousel(carousel: cms.Carousel, delayS: number = 0): BotonicMsgs {
    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    return {
      type: 'carousel',
      delay: delayS,
      data: {
        elements: carousel.elements.map(e => this.element(e)),
      },
    } as BotonicMsg
  }

  private element(cmsElement: cms.Element): any {
    return {
      img: cmsElement.imgUrl,
      title: cmsElement.title,
      subtitle: cmsElement.subtitle,
      buttons: this.convertButtons(cmsElement.buttons, ButtonStyle.BUTTON),
    }
  }

  private convertButtons(cmsButtons: cms.Button[], style: ButtonStyle): any[] {
    const maxButtons =
      style == ButtonStyle.BUTTON
        ? this.options.maxButtons
        : this.options.maxQuickReplies
    cmsButtons = cmsButtons.slice(0, maxButtons)
    return cmsButtons.map(cmsButton => {
      const msgButton = {
        payload: cmsButton.callback.payload,
        url: cmsButton.callback.url,
      } as any
      if (style == ButtonStyle.BUTTON) {
        msgButton['title'] = cmsButton.text
      } else {
        msgButton['text'] = cmsButton.text
      }
      return msgButton
    })
  }

  text(text: cms.Text, delayS: number = 0): BotonicMsgs {
    const msg: any = {
      type: 'text',
      delay: delayS,
      data: { text: text.text },
    }
    const buttons = this.convertButtons(text.buttons, text.buttonsStyle)
    if (text.buttonsStyle == ButtonStyle.QUICK_REPLY) {
      msg['replies'] = buttons
    } else {
      msg['buttons'] = buttons
    }
    return this.appendFollowUp(msg, text)
  }

  startUp(startUp: cms.StartUp): BotonicMsgs {
    const img: BotonicMsg = {
      type: 'image',
      data: { image: startUp.imgUrl },
    }
    const text: BotonicText = {
      type: 'text',
      data: { text: startUp.text },
      buttons: this.convertButtons(startUp.buttons, ButtonStyle.BUTTON),
    }
    return this.appendFollowUp([img, text], startUp)
  }

  image(img: cms.Image): BotonicMsgs {
    const msg: BotonicMsg = {
      type: 'image',
      data: {
        image: img.imgUrl,
      },
    }
    return this.appendFollowUp(msg, img)
  }

  private appendFollowUp(
    contentMsgs: BotonicMsgs,
    content: TopContent
  ): BotonicMsgs {
    if (content.common.followUp) {
      const followUp = this.followUp(content.common.followUp)
      const followUps = Array.isArray(followUp) ? followUp : [followUp]
      if (Array.isArray(contentMsgs)) {
        contentMsgs.push(...followUps)
      } else {
        contentMsgs = [contentMsgs, ...followUps]
      }
      return contentMsgs
    }
    return contentMsgs
  }

  private followUp(followUp: cms.FollowUp): BotonicMsgs {
    if (followUp instanceof cms.Text) {
      // give user time to read the initial text
      return this.text(followUp, this.options.followUpDelaySeconds)
    } else if (followUp instanceof cms.Carousel) {
      // for carousels, the previous text usually introduces the carousel. So, we set a smaller delay
      return this.carousel(followUp, 2)
    } else if (followUp instanceof cms.Image) {
      return this.image(followUp)
    } else if (followUp instanceof cms.StartUp) {
      return this.startUp(followUp)
    } else {
      throw new Error('Unexpected followUp type ' + typeof followUp)
    }
  }
}
