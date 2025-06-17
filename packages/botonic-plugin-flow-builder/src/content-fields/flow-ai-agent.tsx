import { Text } from '@botonic/react'

import { ContentFieldsBase } from './content-fields-base'
import { HtAiAgentNode } from './hubtype-fields/ai-agent'

export class FlowAiAgent extends ContentFieldsBase {
  public code: string = ''
  public name: string = ''
  public instructions: string = ''
  public activeTools?: { name: string }[]
  public text: string = ''

  static fromHubtypeCMS(component: HtAiAgentNode): FlowAiAgent {
    const newAiAgent = new FlowAiAgent(component.id)
    newAiAgent.name = component.content.name
    newAiAgent.instructions = component.content.instructions
    newAiAgent.activeTools = component.content.active_tools

    return newAiAgent
  }

  toBotonic(id: string): JSX.Element {
    return <Text key={id}>{this.text}</Text>
  }
}
