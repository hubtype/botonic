import { AgenticOutputMessage } from '@botonic/core'
import { Button, Carousel, Text } from '@botonic/react'

import { DO_NOTHING_PAYLOAD, SOURCE_INFO_SEPARATOR } from '../constants'
import { ContentFieldsBase } from './content-fields-base'
import { FlowElement } from './flow-element'
import { HtAiAgentNode, HtInputGuardrailRule } from './hubtype-fields/ai-agent'

export class FlowAiAgent extends ContentFieldsBase {
  public code: string = ''
  public name: string = ''
  public instructions: string = ''
  public activeTools?: { name: string }[]
  public inputGuardrailRules: HtInputGuardrailRule[]

  public responses: AgenticOutputMessage[] = []

  static fromHubtypeCMS(component: HtAiAgentNode): FlowAiAgent {
    const newAiAgent = new FlowAiAgent(component.id)
    newAiAgent.name = component.content.name
    newAiAgent.instructions = component.content.instructions
    newAiAgent.activeTools = component.content.active_tools
    newAiAgent.inputGuardrailRules =
      component.content.input_guardrail_rules || []
    return newAiAgent
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
                {response.content.buttons.map((button, buttonIndex) => (
                  <Button
                    key={buttonIndex}
                    payload={`${DO_NOTHING_PAYLOAD}${SOURCE_INFO_SEPARATOR}${buttonIndex}`}
                  >
                    {button}
                  </Button>
                ))}
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
