import { INPUT } from '@botonic/core'

import {
  omitCampaignMessageProps,
  toCampaignHtmlAttributes,
} from '../util/campaign-message-attributes'
import { renderComponent } from '../util/react'
import type { CampaignMessageProps } from './index-types'
import { Message } from './message'

export interface WhatsappProductProps extends CampaignMessageProps {
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
      // @ts-expect-error Property 'message' does not exist on type 'JSX.IntrinsicElements'.
      <message
        {...omitCampaignMessageProps(props)}
        {...toCampaignHtmlAttributes(props)}
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
