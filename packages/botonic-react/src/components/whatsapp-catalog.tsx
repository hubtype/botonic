import { INPUT } from '@botonic/core'

import { useCampaignMessageAttributes } from '../contexts/campaign-message-attributes'
import { renderComponent } from '../util/react'
import type { CampaignMessageProps } from './index-types'
import { Message } from './message'

export interface WhatsappCatalogProps extends CampaignMessageProps {
  body: string
  footer?: string
  thumbnailProductId?: string
}

const serialize = (message: string) => {
  return { text: message }
}

export const WhatsappCatalog = (props: WhatsappCatalogProps) => {
  const { messageProps, campaignHtmlAttributes } =
    useCampaignMessageAttributes(props)

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
      // @ts-expect-error Property 'message' does not exist on type 'JSX.IntrinsicElements'.
      <message
        {...messageProps}
        {...campaignHtmlAttributes}
        body={props.body}
        footer={props.footer}
        thumbnailProductId={props.thumbnailProductId}
        type={INPUT.WHATSAPP_CATALOG}
      />
    )
  }

  return renderComponent({ renderBrowser, renderNode })
}
