import { isWhatsapp } from '@botonic/core'
import React, { useContext } from 'react'

import { RequestContext } from '../../contexts'
import { COMPONENT_DISPLAY_NAMES } from '../constants'
import { Reply } from '../reply'

export const MultichannelReply = props => {
  const requestContext = useContext(RequestContext)
  const hasPath = () => Boolean(props.path)
  const hasPayload = () => Boolean(props.payload)
  const getText = () => `${props.children}`

  if (isWhatsapp(requestContext.session)) {
    if (hasPath() || hasPayload()) return `${getText()}`
    return null
  } else {
    return <Reply {...props}>{props.children}</Reply>
  }
}

MultichannelReply.displayName = COMPONENT_DISPLAY_NAMES.MultichannelReply
