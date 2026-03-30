import type { BotContext } from '@botonic/core'
import { Video } from '@botonic/react'

import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import type { HtVideoNode } from './hubtype-fields'

export class FlowVideo extends ContentFieldsBase {
  public src = ''

  static fromHubtypeCMS(component: HtVideoNode, locale: string): FlowVideo {
    const newVideo = new FlowVideo(component.id)
    newVideo.code = component.code
    newVideo.src = FlowVideo.getVideoByLocale(locale, component.content.video)
    newVideo.followUp = component.follow_up

    return newVideo
  }

  async trackFlow(botContext: BotContext): Promise<void> {
    await trackOneContent(botContext, this)
  }

  async processContent(botContext: BotContext): Promise<void> {
    await this.trackFlow(botContext)
    return
  }

  toBotonic(): JSX.Element {
    return <Video key={this.id} src={this.src} />
  }
}
