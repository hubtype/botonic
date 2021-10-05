import * as cms from '../cms'
import { ButtonStyle } from '../cms'

export class RenderOptions {
  followUpDelaySeconds = 3
  defaultButtonsStyle?: ButtonStyle = ButtonStyle.BUTTON
}

export interface BotonicMsg {
  type: 'text' | 'image'
  delay?: number
  data: any
  buttons?: any[]
}

export class BotonicMsgConverter {
  readonly options: RenderOptions

  constructor(options: Partial<RenderOptions> = {}) {
    this.options = { ...new RenderOptions(), ...options }
  }

  convert(content: cms.Content): BotonicMsg[] {
    if (content instanceof cms.Text) {
      return this.text(content)
    }
    if (content instanceof cms.Image) {
      return this.image(content)
    }
    throw new Error('Unsupported content type')
  }

  text(text: cms.Text, delayS = 0): BotonicMsg[] {
    const buttonsStyle = text.buttonsStyle || this.options.defaultButtonsStyle
    const buttons = this.convertButtons(text.buttons, buttonsStyle!)
    const msg: any = {
      type: 'text',
      delay: delayS,
      data: { text: text.text },
    }
    if (buttonsStyle === ButtonStyle.QUICK_REPLY) {
      msg['replies'] = buttons
    } else {
      msg['buttons'] = buttons
    }
    return this.appendFollowUp(msg, text)
  }

  private convertButtons(cmsButtons: cms.Button[], style: ButtonStyle): any[] {
    return cmsButtons.map(cmsButton => {
      const msgButton = {
        payload: cmsButton.target,
      } as any
      if (style === ButtonStyle.BUTTON) {
        msgButton['title'] = cmsButton.text
      } else {
        msgButton['text'] = cmsButton.text
      }
      return msgButton
    })
  }

  image(img: cms.Image, delayS = 0): BotonicMsg[] {
    const msgs: BotonicMsg[] = []
    const msg: BotonicMsg = {
      type: 'image',
      delay: delayS,
      data: {
        image: img.image,
      },
    }
    msgs.push(msg)
    return msgs
  }

  private appendFollowUp(
    contentMsgs: BotonicMsg[],
    content: cms.Content
  ): BotonicMsg[] {
    if (content.common.followup) {
      const followUp = this.followUp(content.common.followup)
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

  private followUp(followUp: cms.Content): BotonicMsg[] {
    if (followUp instanceof cms.Text) {
      return this.text(followUp, this.options.followUpDelaySeconds)
    } else if (followUp instanceof cms.Image) {
      return this.image(followUp)
    } else {
      throw new Error(`Unexpected followUp type: ${typeof followUp}`)
    }
  }
}
