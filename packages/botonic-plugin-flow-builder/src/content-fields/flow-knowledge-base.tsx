import { Text } from '@botonic/react'
import React from 'react'

import { ContentFieldsBase } from './content-fields-base'
import { HtKnowledgeBaseNode } from './hubtype-fields'

export class FlowKnowledgeBase extends ContentFieldsBase {
  public code: string = ''
  public feedbackEnabled: boolean = false
  public sources: string[] = []
  public text: string = ''
  public inferenceId?: string
  public botInteractionId: string

  static fromHubtypeCMS(component: HtKnowledgeBaseNode): FlowKnowledgeBase {
    const newKnowledgeBase = new FlowKnowledgeBase(component.id)
    newKnowledgeBase.code = component.code
    newKnowledgeBase.feedbackEnabled = component.content.feedback_enabled
    newKnowledgeBase.sources = component.content.sources
    newKnowledgeBase.botInteractionId = component.content.bot_interaction_id

    return newKnowledgeBase
  }

  toBotonic(id: string): JSX.Element {
    return (
      <Text
        key={id}
        feedbackEnabled={this.feedbackEnabled}
        inferenceId={this.inferenceId}
        botInteractionId={this.botInteractionId}
      >
        {this.text}
      </Text>
    )
  }
}
