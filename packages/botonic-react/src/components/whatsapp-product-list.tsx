import { INPUT } from '@botonic/core'
import React from 'react'

import { renderComponent } from '../util/react'
import { Message } from './message'

export interface ProductItem {
  product_retailer_id: string
}

export interface WhatsappProductListSection {
  title: string
  product_items: ProductItem[]
}

export interface WhatsappProductListProps {
  body: string
  header: string
  catalogId: string
  sections: WhatsappProductListSection[]
  footer?: string
}

const serialize = (message: string) => {
  return { text: message }
}

export const WhatsappProductList = (props: WhatsappProductListProps) => {
  const renderBrowser = () => {
    // Return a dummy message for browser
    const message = `WhatsApp Product List would be sent to the user.`
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
        header={props.header}
        sections={JSON.stringify(props.sections)}
        catalogId={props.catalogId}
        type={INPUT.WHATSAPP_PRODUCT_LIST}
      />
    )
  }

  return renderComponent({ renderBrowser, renderNode })
}
