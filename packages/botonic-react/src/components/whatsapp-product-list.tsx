import { INPUT } from '@botonic/core'
import React from 'react'
import snakecaseKeys from 'snakecase-keys'

import { renderComponent } from '../util/react'
import { Message } from './message'

export interface ProductItem {
  productRetailerId: string
}

export interface WhatsappProductListSection {
  title: string
  productItems: ProductItem[]
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
        sections={JSON.stringify(
          snakecaseKeys(props.sections as unknown as Record<string, unknown>[])
        )}
        catalogId={props.catalogId}
        type={INPUT.WHATSAPP_PRODUCT_LIST}
      />
    )
  }

  return renderComponent({ renderBrowser, renderNode })
}
