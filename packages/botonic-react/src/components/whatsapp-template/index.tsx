import { INPUT } from '@botonic/core'
import React from 'react'

import { renderComponent } from '../../util/react'
import { Message } from '../message'

const serialize = (message: string) => {
  return { text: message }
}

export interface WhatsappTemplateProps {
  name: string
  language: string
  namespace?: string
  header?: Record<string, any>
  body?: Record<string, any>
  footer?: Record<string, any>
  buttons?: Record<string, any>
}

export const WhatsappTemplate = (props: WhatsappTemplateProps) => {
  const renderBrowser = () => {
    // Return a dummy message for browser
    const message = `Template ${props.name} with language ${props.language} and namespace ${props.namespace} would be sent to the user.`
    return (
      <Message json={serialize(message)} {...props} type={INPUT.TEXT}>
        {message}
      </Message>
    )
  }

  const renderNode = () => {
    return (
      // @ts-ignore Property 'message' does not exist on type 'JSX.IntrinsicElements'.
      <message
        {...props}
        name={props.name}
        language={props.language}
        namespace={props.namespace}
        header={props.header && JSON.stringify(props.header)}
        body={props.body && JSON.stringify(props.body)}
        footer={props.footer && JSON.stringify(props.footer)}
        buttons={props.buttons && JSON.stringify(props.buttons)}
        type={INPUT.WHATSAPP_TEMPLATE}
      />
    )
  }

  return renderComponent({ renderBrowser, renderNode })
}
