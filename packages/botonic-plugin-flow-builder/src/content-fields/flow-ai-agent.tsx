import { Carousel, Text } from '@botonic/react'

import { ContentFieldsBase } from './content-fields-base'
import { FlowButton } from './flow-button'
import { FlowElement } from './flow-element'
import { HtAiAgentNode } from './hubtype-fields/ai-agent'
import { HtButtonStyle } from './hubtype-fields/node-types'

export class FlowAiAgent extends ContentFieldsBase {
  public code: string = ''
  public name: string = ''
  public instructions: string = ''
  public activeTools?: { name: string }[]
  public text: string = ''
  public buttons: FlowButton[] = []
  public elements: FlowElement[] = []
  public outputType: string = 'text'

  static fromHubtypeCMS(component: HtAiAgentNode): FlowAiAgent {
    const newAiAgent = new FlowAiAgent(component.id)
    newAiAgent.name = component.content.name
    newAiAgent.instructions = component.content.instructions
    newAiAgent.activeTools = component.content.active_tools

    return newAiAgent
  }

  toBotonic(id: string): JSX.Element {
    if (this.outputType === 'carousel') {
      return (
        <Carousel key={id}>
          {this.elements.map(element => element.toBotonic(id))}
        </Carousel>
      )
    } else {
      return (
        <Text key={id}>
          {this.text}
          {this.buttons.map((button, buttonIndex) =>
            button.renderButton(buttonIndex, HtButtonStyle.BUTTON)
          )}
        </Text>
      )
    }
  }
}
