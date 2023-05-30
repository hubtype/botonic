import { INPUT } from '@botonic/core'
import React from 'react'

import { renderComponent } from '../util/react'
import { Message } from './message'

// TODO: Add validation in component

interface Action {
  button: string
  sections: Section[]
}

interface Section {
  title: string
  rows: Row[]
}

interface Row {
  id: string
  title: string
  description: string
}

const serialize = _whatsappTemplateProps => {
  // TODO: Implement to have data persistance in localStorage, not needed for this WhatsApp development
  return {}
}

export interface WhatsappButtonListProps {
  header: string
  body: string
  footer: string
  action: Action
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
      // @ts-ignore
      <message
        {...props}
        header={props.header}
        body={props.body}
        footer={props.footer}
        action={props.action}
        type={INPUT.WHATSAPP_BUTTON_LIST}
      />
    )
  }

  return renderComponent({ renderBrowser, renderNode })
}
