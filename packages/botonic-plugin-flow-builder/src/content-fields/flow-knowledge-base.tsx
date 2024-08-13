import { ActionRequest, Text } from '@botonic/react'
import React from 'react'

import { ContentFieldsBase } from './content-fields-base'
import { HtKnowledgeBaseNode } from './hubtype-fields'

export class FlowKnowledgeBase extends ContentFieldsBase {
  public code: string = ''
  public feedbackEnabled: boolean = false
  public sources: string[] = []
  public text: string = ''
  public inferenceId?: string
  public sourcesData: { id: string; name: string }[] = []

  static fromHubtypeCMS(component: HtKnowledgeBaseNode): FlowKnowledgeBase {
    const newKnowledgeBase = new FlowKnowledgeBase(component.id)
    newKnowledgeBase.code = component.code
    newKnowledgeBase.feedbackEnabled = component.content.feedback_enabled
    newKnowledgeBase.sourcesData = component.content.sources_data

    return newKnowledgeBase
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    return (
      <Text
        key={id}
        feedbackEnabled={this.feedbackEnabled}
        inferenceId={this.inferenceId}
        botInteractionId={request.input.bot_interaction_id}
      >
        {this.text}
      </Text>
    )
  }
}
