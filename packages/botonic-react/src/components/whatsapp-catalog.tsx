import { INPUT } from '@botonic/core'
import React from 'react'

import { renderComponent } from '../util/react'
import { Message } from './message'

export interface WhatsappCatalogProps {
  body: string
  footer?: string
  thumbnailProductId?: string
}

const serialize = (message: string) => {
  return { text: message }
}

export const WhatsappCatalog = (props: WhatsappCatalogProps) => {
  const renderBrowser = () => {
    // Return a dummy message for browser
    const message = `WhatsApp Catalog would be sent to the user.`
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
        thumbnailProductId={props.thumbnailProductId}
        type={INPUT.WHATSAPP_CATALOG}
      />
    )
  }

  return renderComponent({ renderBrowser, renderNode })
}
