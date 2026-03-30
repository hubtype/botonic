import type { BotContext } from '@botonic/core'
import { Image } from '@botonic/react'

import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import type { HtImageNode } from './hubtype-fields'

export class FlowImage extends ContentFieldsBase {
  public src = ''

  static fromHubtypeCMS(component: HtImageNode, locale: string): FlowImage {
    const newImage = new FlowImage(component.id)
    newImage.code = component.code
    newImage.src = FlowImage.getAssetByLocale(locale, component.content.image)
    newImage.followUp = component.follow_up

    return newImage
  }

  async trackFlow(botContext: BotContext): Promise<void> {
    await trackOneContent(botContext, this)
  }

  async processContent(botContext: BotContext): Promise<void> {
    await this.trackFlow(botContext)
    return
  }

  toBotonic(): JSX.Element {
    return <Image key={this.id} src={this.src} />
  }
}
