import { INPUT } from '@botonic/core'
import React from 'react'

import { renderComponent } from '../util/react'
import { Message } from './message'

export interface WhatsappProductProps {
  body: string
  catalogId: string
  productId: string
  footer?: string
}

const serialize = (message: string) => {
  return { text: message }
}

export const WhatsappProduct = (props: WhatsappProductProps) => {
  const renderBrowser = () => {
    // Return a dummy message for browser
    const message = `WhatsApp Product would be sent to the user.`
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
        body={props.body}
        footer={props.footer}
        catalogId={props.catalogId}
        productId={props.productId}
        type={INPUT.WHATSAPP_PRODUCT}
      />
    )
  }

  return renderComponent({ renderBrowser, renderNode })
}
