import * as cms from '../cms'
import { ButtonStyle, CmsException, TopContent } from '../cms'

export class RenderOptions {
  followUpDelaySeconds = 4
  maxButtons = 3
  maxQuickReplies = 5
  /** Some integrations fail when a field is empty*/
  replaceEmptyStringsWith?: string
  defaultButtonsStyle?: ButtonStyle = ButtonStyle.BUTTON
}

// TODO consider moving it to @botonic/core
export interface BotonicMsg {
  type: 'carousel' | 'text' | 'image' | 'document'
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

export interface BotonicDocument extends BotonicMsg {
  src: string
}

export class BotonicMsgConverter {
  readonly options: RenderOptions

  constructor(options: Partial<RenderOptions> = {}) {
    this.options = { ...new RenderOptions(), ...options }
  }

  convert(content: cms.MessageContent, delayS = 0): BotonicMsgs {
    if (content instanceof cms.Carousel) {
      return this.carousel(content, delayS)
    }
    if (content instanceof cms.Text) {
      return this.text(content, delayS)
    }
    if (content instanceof cms.StartUp) {
      return this.startUp(content, delayS)
    }
    if (content instanceof cms.Image) {
      return this.image(content, delayS)
    }
    if (content instanceof cms.Document) {
      return this.document(content, delayS)
    }
    throw new CmsException(`Unsupported content type ${content.contentType}`)
  }

  carousel(carousel: cms.Carousel, delayS = 0): BotonicMsgs {
    const msg = {
      type: 'carousel',
      delay: delayS,
      data: {
        elements: carousel.elements.map(e => this.element(e)),
      },
    } as BotonicMsg
    return this.appendFollowUp(msg, carousel)
  }

  private element(cmsElement: cms.Element): any {
    return {
      img: cmsElement.imgUrl,
      title: this.str(cmsElement.title),
      subtitle: this.str(cmsElement.subtitle),
      buttons: this.convertButtons(cmsElement.buttons, ButtonStyle.BUTTON),
    }
  }

  private convertButtons(cmsButtons: cms.Button[], style: ButtonStyle): any[] {
    const maxButtons =
      style == ButtonStyle.BUTTON
        ? this.options.maxButtons
        : this.options.maxQuickReplies
    if (cmsButtons.length > maxButtons) {
      console.error('Content has more buttons than maximum. Trimming')
      cmsButtons = cmsButtons.slice(0, maxButtons)
    }
    return cmsButtons.map(cmsButton => {
      const msgButton = {
        payload: cmsButton.callback.payload,
        url: cmsButton.callback.url,
      } as any
      if (style == ButtonStyle.BUTTON) {
        msgButton['title'] = this.str(cmsButton.text)
      } else {
        msgButton['text'] = this.str(cmsButton.text)
      }
      return msgButton
    })
  }

  text(text: cms.Text, delayS = 0): BotonicMsgs {
    const msg: any = {
      type: 'text',
      delay: delayS,
      data: { text: this.str(text.text) },
    }
    const buttonsStyle = text.buttonsStyle || this.options.defaultButtonsStyle
    const buttons = this.convertButtons(text.buttons, buttonsStyle!)
    if (buttonsStyle == ButtonStyle.QUICK_REPLY) {
      msg['replies'] = buttons
    } else {
      msg['buttons'] = buttons
    }
    return this.appendFollowUp(msg, text)
  }

  startUp(startUp: cms.StartUp, delayS = 0): BotonicMsgs {
    const img: BotonicMsg = {
      type: 'image',
      delay: delayS,
      data: { image: startUp.imgUrl },
    }
    const text: BotonicText = {
      type: 'text',
      data: { text: this.str(startUp.text) },
      buttons: this.convertButtons(startUp.buttons, ButtonStyle.BUTTON),
    }
    return this.appendFollowUp([img, text], startUp)
  }

  image(img: cms.Image, delayS = 0): BotonicMsgs {
    const msg: BotonicMsg = {
      type: 'image',
      delay: delayS,
      data: {
        image: img.imgUrl,
      },
    }
    return this.appendFollowUp(msg, img)
  }

  document(doc: cms.Document, delayS = 0): BotonicMsgs {
    const msg: BotonicMsg = {
      type: 'document',
      delay: delayS,
      data: {
        document: doc.docUrl,
      },
    }
    return this.appendFollowUp(msg, doc)
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

  private str(str: string): string {
    if (this.options.replaceEmptyStringsWith == undefined) {
      return str
    }
    return str || this.options.replaceEmptyStringsWith
  }
}
