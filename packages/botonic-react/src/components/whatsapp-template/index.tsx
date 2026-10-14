import { INPUT } from '@botonic/core'

import {
  resolveCampaignHtmlAttributes,
  useCampaignFirstMessageContext,
} from '../../contexts/campaign-first-message'
import { omitCampaignMessageProps } from '../../util/campaign-message-attributes'
import { renderComponent } from '../../util/react'
import type { CampaignMessageProps } from '../index-types'
import { Message } from '../message'
import type {
  WhatsappTemplateComponentBody,
  WhatsappTemplateComponentButtons,
  WhatsappTemplateComponentFooter,
  WhatsappTemplateComponentHeader,
} from './types'

const serialize = (message: string) => {
  return { text: message }
}

export interface WhatsappTemplateProps extends CampaignMessageProps {
  name: string
  language: string
  namespace?: string
  header?: WhatsappTemplateComponentHeader
  body?: WhatsappTemplateComponentBody
  footer?: WhatsappTemplateComponentFooter
  buttons?: WhatsappTemplateComponentButtons
}

export const WhatsappTemplate = (props: WhatsappTemplateProps) => {
  const { takeCampaignMessageProps } = useCampaignFirstMessageContext()

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
      // @ts-expect-error Property 'message' does not exist on type 'JSX.IntrinsicElements'.
      <message
        {...omitCampaignMessageProps(props)}
        {...resolveCampaignHtmlAttributes(props, takeCampaignMessageProps)}
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
