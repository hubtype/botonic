import type { BotContext } from '@botonic/core'
import { Text } from '@botonic/react'

import { ContentFieldsBase } from './content-fields-base'
import type { HtKnowledgeBaseNode } from './hubtype-fields'

export const DISABLED_MEMORY_LENGTH = 1

export class FlowKnowledgeBase extends ContentFieldsBase {
  public feedbackEnabled: boolean = false
  public sources: string[] = []
  public text: string = ''
  public inferenceId?: string
  public sourcesData: { id: string; name: string }[] = []
  public instructions: string
  public hasMemory: boolean
  public memoryLength: number

  static fromHubtypeCMS(component: HtKnowledgeBaseNode): FlowKnowledgeBase {
    const newKnowledgeBase = new FlowKnowledgeBase(component.id)
    newKnowledgeBase.code = component.code
    newKnowledgeBase.feedbackEnabled = component.content.feedback_enabled
    newKnowledgeBase.sourcesData = component.content.sources_data
    newKnowledgeBase.instructions = component.content.instructions
    newKnowledgeBase.hasMemory = component.content.has_memory || false
    newKnowledgeBase.memoryLength =
      component.content.memory_length || DISABLED_MEMORY_LENGTH
    newKnowledgeBase.followUp = component.follow_up

    return newKnowledgeBase
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async trackFlow(_botContext: BotContext): Promise<void> {
    // TODO: Review how we can track here the knowledge base event here.
    // We should store event args in an attribute of FlowKnowledgeBase
    // when knowledge base is resolved inside the flow builder action
  }

  async processContent(botContext: BotContext): Promise<void> {
    await this.trackFlow(botContext)
    return
  }

  toBotonic(botContext: BotContext): JSX.Element {
    return (
      <Text
        key={this.id}
        feedbackEnabled={this.feedbackEnabled}
        inferenceId={this.inferenceId}
        botInteractionId={botContext.input.bot_interaction_id}
      >
        {this.text}
      </Text>
    )
  }
}
