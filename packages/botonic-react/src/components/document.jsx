import { INPUT, isBrowser } from '@botonic/core'
import React from 'react'
import styled from 'styled-components'

import { ROLES } from '../constants'
import { Message } from './message'

const StyledEmbed = styled.embed`
  border-radius: 8px;
  height: 300px;
  margin: 10px;
`

const serialize = documentProps => {
  return { document: documentProps.src }
}

export const Document = props => {
  let content = props.children
  if (isBrowser()) content = <StyledEmbed src={props.src} />
  return (
    <Message
      role={ROLES.DOCUMENT_MESSAGE}
      json={serialize(props)}
      {...props}
      type={INPUT.DOCUMENT}
    >
      {content}
    </Message>
  )
}

Document.serialize = serialize
