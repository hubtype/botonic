import { Text } from '@botonic/react'
import React from 'react'

import { ContentFieldsBase } from './content-fields-base'
import { HtKnowledgeBaseNode } from './hubtype-fields'

export class FlowKnowledgeBase extends ContentFieldsBase {
  public code: string = ''
  public acceptFeedback: boolean = false
  public sources: string[] = []
  public text: string = ''
  public inferenceId?: string

  static fromHubtypeCMS(component: HtKnowledgeBaseNode): FlowKnowledgeBase {
    const newKnowledgeBase = new FlowKnowledgeBase(component.id)
    newKnowledgeBase.code = component.code
    newKnowledgeBase.acceptFeedback = component.content.accept_feedback
    newKnowledgeBase.sources = component.content.sources

    return newKnowledgeBase
  }

  toBotonic(id: string): JSX.Element {
    return (
      <Text
        key={id}
        withfeedback={this.acceptFeedback}
        inferenceid={this.inferenceId}
      >
        {this.text}
      </Text>
    )
  }
}
