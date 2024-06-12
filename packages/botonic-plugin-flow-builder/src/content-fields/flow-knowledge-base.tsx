import { Text } from '@botonic/react'
import React from 'react'

import { ContentFieldsBase } from './content-fields-base'
import { HtKnowledgeBaseNode } from './hubtype-fields'

export class FlowKnowledgeBase extends ContentFieldsBase {
  public code = ''
  public sources: string[] = []
  public text = ''

  static fromHubtypeCMS(component: HtKnowledgeBaseNode): FlowKnowledgeBase {
    const newKnowledgeBase = new FlowKnowledgeBase(component.id)
    newKnowledgeBase.code = component.code
    newKnowledgeBase.sources = component.content.sources

    return newKnowledgeBase
  }

  toBotonic(id: string): JSX.Element {
    return <Text key={id}>{this.text}</Text>
  }
}