import { INPUT } from '@botonic/core'

import { renderComponent } from '../util/react'
import { convertToMarkdownMeta } from './multichannel/whatsapp/markdown-meta'
import { WHATSAPP_MAX_BODY_CHARS } from './multichannel/whatsapp/constants'
import { Text } from './text'

export interface WhatsappRequestContactInfoProps {
  body: string
}

const validateBody = (body: string): string => {
  if (!body) {
    throw new Error('WhatsappRequestContactInfo: body is required')
  }
  if (body.length > WHATSAPP_MAX_BODY_CHARS) {
    throw new Error(
      `WhatsappRequestContactInfo: body exceeds maximum length of ${WHATSAPP_MAX_BODY_CHARS} characters`
    )
  }
  return convertToMarkdownMeta(body)
}

export const WhatsappRequestContactInfo = (
  props: WhatsappRequestContactInfoProps
) => {
  const renderBrowser = () => <Text>{props.body}</Text>

  const renderNode = () => {
    const body = validateBody(props.body)
    return (
      // @ts-expect-error Property 'message' does not exist on type 'JSX.IntrinsicElements'.
      <message body={body} type={INPUT.WHATSAPP_REQUEST_CONTACT_INFO} />
    )
  }

  return renderComponent({ renderBrowser, renderNode })
}
