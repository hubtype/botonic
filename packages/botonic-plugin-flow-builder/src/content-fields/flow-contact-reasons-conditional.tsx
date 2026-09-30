import type { BotContext, HubtypeCaseContactReason } from '@botonic/core'
import { findMatchingContactReasonBranch } from './contact-reasons-conditional-matcher'
import { ContentFieldsBase } from './content-fields-base'
import type { HtNodeLink } from './hubtype-fields/common'
import type {
  HtContactReasonBranch,
  HtContactReasonsNode,
} from './hubtype-fields/contact-reasons-conditional'

export class FlowContactReasonsConditional extends ContentFieldsBase {
  public contactReasons: HtContactReasonBranch[] = []
  public defaultTarget?: HtNodeLink

  static fromHubtypeCMS(
    component: HtContactReasonsNode,
    botContext: BotContext
  ): FlowContactReasonsConditional {
    const newContactReasonsConditional = new FlowContactReasonsConditional(
      component.id
    )
    newContactReasonsConditional.contactReasons =
      component.content.contact_reasons
    newContactReasonsConditional.defaultTarget =
      component.content.default_target
    newContactReasonsConditional.setFollowUp(botContext)
    return newContactReasonsConditional
  }

  private setFollowUp(botContext: BotContext): void {
    const sessionContactReasons: HubtypeCaseContactReason[] | undefined =
      botContext.session._hubtype_case_contact_reasons

    if (sessionContactReasons) {
      const matchingBranch = findMatchingContactReasonBranch(
        sessionContactReasons,
        this.contactReasons
      )
      if (matchingBranch?.target) {
        this.followUp = matchingBranch.target
      }
    }

    this.followUp ??= this.defaultTarget
  }

  async trackFlow(_botContext: BotContext): Promise<void> {
    // await trackFlow(botContext)
    return
  }

  async processContent(_botContext: BotContext): Promise<void> {
    // await this.filterContent(botContext, this)
    // await this.trackFlow(botContext)
    return
  }

  toBotonic() {
    return <></>
  }
}
