import { AgenticOutputMessage, isWhatsapp } from '@botonic/core'
import {
  ActionRequest,
  Button,
  Carousel,
  Text,
  WhatsappInteractiveMediaCarousel,
} from '@botonic/react'

import { EMPTY_PAYLOAD, SOURCE_INFO_SEPARATOR } from '../constants'
import { ContentFieldsBase } from './content-fields-base'
import { FlowElement } from './flow-element'
import { HtAiAgentNode, HtInputGuardrailRule } from './hubtype-fields/ai-agent'

export class FlowAiAgent extends ContentFieldsBase {
  public code: string = ''
  public name: string = ''
  public instructions: string = ''
  public activeTools?: { name: string }[]
  public inputGuardrailRules: HtInputGuardrailRule[]
  public sources?: { id: string; name: string }[]

  public responses: AgenticOutputMessage[] = []

  static fromHubtypeCMS(component: HtAiAgentNode): FlowAiAgent {
    const newAiAgent = new FlowAiAgent(component.id)
    newAiAgent.name = component.content.name
    newAiAgent.instructions = component.content.instructions
    newAiAgent.activeTools = component.content.active_tools
    newAiAgent.inputGuardrailRules =
      component.content.input_guardrail_rules || []
    newAiAgent.sources = component.content.sources
    return newAiAgent
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
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
            if (isWhatsapp(request.session)) {
              return (
                <WhatsappInteractiveMediaCarousel
                  cards={response.content.elements.map(element => {
                    const buttonText = element.button.text
                    const buttonUrl = element.button.url || ''
                    const imageLink = element.image

                    return {
                      text: element.title,
                      action: { buttonText, buttonUrl, imageLink },
                    }
                  })}
                  textMessage={response.content.text || ''}
                />
              )
            }
            return (
              <Carousel key={id}>
                {response.content.elements.map((element, index) =>
                  FlowElement.fromAIAgent(
                    `${id}-element-${index}`,
                    element
                  ).toBotonic(id)
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
