import type { BotContext } from '@botonic/core'

import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import type { HtDoNothingNode } from './hubtype-fields'

export class FlowDoNothing extends ContentFieldsBase {
  static fromHubtypeCMS(cmsDoNothing: HtDoNothingNode): FlowDoNothing {
    const newDoNothing = new FlowDoNothing(cmsDoNothing.id)
    newDoNothing.code = cmsDoNothing.code
    newDoNothing.followUp = cmsDoNothing.follow_up

    return newDoNothing
  }

  async trackFlow(botContext: BotContext): Promise<void> {
    await trackOneContent(botContext, this)
  }

  async processContent(botContext: BotContext): Promise<void> {
    await this.filterContent(botContext, this)
    await this.trackFlow(botContext)
    return
  }

  toBotonic(): JSX.Element {
    return <></>
  }
}
