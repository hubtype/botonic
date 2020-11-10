import { INPUT } from '@botonic/core'
import React from 'react'

import { renderComponent } from '../util/react'
import { Message } from './message'

const serialize = whatsappTemplateProps => {
  return { text: whatsappTemplateProps }
}

export const WhatsappTemplate = props => {
  const renderBrowser = () => {
    // Return a dummy message for browser
    const message = `Template ${props.name} with namespace ${props.namespace} would be sent to the user.`
    return (
      <Message json={serialize(message)} {...props} type={INPUT.TEXT}>
        {message}
      </Message>
    )
  }

  const renderNode = () => {
    return (
      <message
        {...props}
        header={props.header && JSON.stringify(props.header)}
        body={props.body && JSON.stringify(props.body)}
        footer={props.footer && JSON.stringify(props.footer)}
        type={INPUT.WHATSAPP_TEMPLATE}
      />
    )
  }

  return renderComponent({ renderBrowser, renderNode })
}
