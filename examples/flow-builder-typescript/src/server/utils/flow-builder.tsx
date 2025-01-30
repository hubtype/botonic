import { FlowButton, FlowContent, FlowText } from '@botonic/plugin-flow-builder'
import { Multichannel, Text } from '@botonic/react'
import React from 'react'

import { BotRequest } from '../types'

export function renderFlowBuilderContents(
  contents: FlowContent[],
  request: BotRequest
): React.ReactNode {
  return (
    <Multichannel text={{ buttonsAsText: false }}>
      {contents.map(content => {
        if (content instanceof FlowText) {
          return renderContent(content)
        }
        return content.toBotonic(content.id, request)
      })}
    </Multichannel>
  )
}

function renderContent(content: FlowText): JSX.Element {
  return (
    <Text key={content.code}>
      {content.text}
      {renderButtons(content)}
    </Text>
  )
}

function renderButtons(content: FlowText): React.ReactNode {
  return content.buttons.map((button: FlowButton, i: number) => {
    return button.renderButton(i, content.buttonStyle)
  })
}
