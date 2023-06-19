import { INPUT } from '@botonic/core'
import React from 'react'

import { renderComponent } from '../util/react'
import { Message } from './message'

// TODO: Add validation in component

export interface WhatsappButtonListSectionProps {
  title?: string
  rows: WhatsappButtonListRowProps[]
}

export interface WhatsappButtonListRowProps {
  id: string
  title: string
  description: string
}

export interface WhatsappButtonListProps {
  header?: string
  body: string
  footer?: string
  button: string
  sections: WhatsappButtonListSectionProps[]
}

const serialize = _whatsappButtonListProps => {
  // TODO: Implement to have data persistance in localStorage, not needed for this WhatsApp development
  return {}
}

export const WhatsappButtonList = (props: WhatsappButtonListProps) => {
  const renderBrowser = () => {
    // Return a dummy message for browser
    const message = `${JSON.stringify(props)}`
    return (
      <Message
        json={serialize(message)}
        {...props}
        type={INPUT.WHATSAPP_BUTTON_LIST}
      >
        {message}
      </Message>
    )
  }

  const renderNode = () => {
    return (
      // @ts-ignore Property 'message' does not exist on type 'JSX.IntrinsicElements'.
      <message
        {...props}
        sections={JSON.stringify(props.sections)}
        type={INPUT.WHATSAPP_BUTTON_LIST}
      />
    )
  }

  return renderComponent({ renderBrowser, renderNode })
}
