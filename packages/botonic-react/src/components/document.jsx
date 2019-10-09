import React from 'react'

import { Message } from './message'
import { isBrowser } from '@botonic/core'
import styled from 'styled-components'

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
    <Message json={serialize(props)} {...props} type='document'>
      {content}
    </Message>
  )
}

Document.serialize = serialize
