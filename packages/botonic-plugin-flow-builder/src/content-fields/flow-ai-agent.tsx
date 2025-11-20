import { AgenticOutputMessage } from '@botonic/core'
import { ActionRequest, Button, Carousel, Text } from '@botonic/react'

import { EMPTY_PAYLOAD, SOURCE_INFO_SEPARATOR } from '../constants'
import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { FlowElement } from './flow-element'
import { HtAiAgentNode, HtInputGuardrailRule } from './hubtype-fields/ai-agent'

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
    // Review how we can track here the knowledge base event
    await trackOneContent(request, this)
  }

  toBotonic(id: string): JSX.Element {
    return (
      <>
        {this.responses.map((response: AgenticOutputMessage) => {
          if (response.type === 'text') {
            return <Text key={id}>{response.content.text}</Text>
          }

          if (response.type === 'textWithButtons') {
            return (
              <Text key={id}>
                {response.content.text}
                {response.content.buttons.map((button, buttonIndex) => {
                  return (
                    <Button
                      key={buttonIndex}
                      payload={`${EMPTY_PAYLOAD}${SOURCE_INFO_SEPARATOR}${buttonIndex}`}
                    >
                      {button.text}
                    </Button>
                  )
                })}
              </Text>
            )
          }

          if (response.type === 'carousel') {
            return (
              <Carousel key={id}>
                {response.content.elements.map(element =>
                  FlowElement.fromAIAgent(id, element).toBotonic(id)
                )}
              </Carousel>
            )
          }

          return <></>
        })}
      </>
    )
  }
}
