import * as cms from '../cms'

export class RenderOptions {
  followUpDelaySeconds = 3
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
    const msg: any = {
      type: 'text',
      delay: delayS,
      data: { text: text.text },
      buttons: text.buttons ? this.convertButtons(text.buttons) : undefined,
    }
    return this.appendFollowUp(msg, text)
  }

  convertButtons(cmsButtons: cms.Button[]): any[] {
    return cmsButtons.map(cmsButton => {
      const msgButton = {
        title: cmsButton.text,
        payload: cmsButton.target,
      } as any
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
