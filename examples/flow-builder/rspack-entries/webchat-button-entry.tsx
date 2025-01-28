import { WebchatArgs } from '@botonic/react'
import React from 'react'
import ReactDOM from 'react-dom'

import { InitialTriggerButton } from '../src/client/webchat/trigger-button/initial'

export class TriggerButton {
  static render(
    buttonElementId: string,
    elementId: string,
    webchatUrl: string,
    webchatConfig: WebchatArgs,
    language: string
  ): void {
    ReactDOM.render(
      <InitialTriggerButton
        elementId={elementId}
        webchatUrl={webchatUrl}
        webchatConfig={webchatConfig}
        language={language}
      />,
      document.getElementById(buttonElementId)
    )
  }
}
