import type { AgenticOutputMessage } from '@botonic/core'
import type { ActionRequest } from '@botonic/react'

import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { FlowCarousel } from './flow-carousel'
import { FlowText } from './flow-text'
import type {
  HtAiAgentNode,
  HtInputGuardrailRule,
} from './hubtype-fields/ai-agent'

export class FlowAiAgent extends ContentFieldsBase {
  public name: string = ''
  public instructions: string = ''
  public activeTools?: { name: string }[]
  public inputGuardrailRules: HtInputGuardrailRule[]
  public sources?: { id: string; name: string }[]

  public responses: AgenticOutputMessage[] = []

  static fromHubtypeCMS(component: HtAiAgentNode): FlowAiAgent {
    const newAiAgent = new FlowAiAgent(component.id)
    newAiAgent.code = component.code
    newAiAgent.name = component.content.name
    newAiAgent.instructions = component.content.instructions
    newAiAgent.activeTools = component.content.active_tools
    newAiAgent.inputGuardrailRules =
      component.content.input_guardrail_rules || []
    newAiAgent.sources = component.content.sources
    newAiAgent.followUp = component.follow_up

    return newAiAgent
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    // We can call trackFlowContent here but the function no track events for AiAgent contents
    // Review how we can track here the ai agent event
    await trackOneContent(request, this)
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    return (
      <>
        {this.responses.map((response: AgenticOutputMessage) => {
          if (response.type === 'text' || response.type === 'textWithButtons') {
            return FlowText.fromAIAgent(id, response)
          }

          if (response.type === 'carousel') {
            return FlowCarousel.fromAIAgent(id, response, request)
          }

          return <></>
        })}
      </>
    )
  }
}
