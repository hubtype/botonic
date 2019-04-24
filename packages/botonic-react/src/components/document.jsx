import React from 'react'

import { Message } from './message'
import { isBrowser } from '@botonic/core'

const serialize = documentProps => {
  return { document: documentProps.src }
}

export const Document = props => {
  let content = ''
  if (isBrowser())
    content = (
      <embed
        style={{
          borderRadius: '8px',
          height: '300px',
          margin: '10px'
        }}
        src={props.src}
      />
    )
  return (
    <Message
      style={{ maxWidth: '60%' }}
      json={serialize(props)}
      {...props}
      type='document'
    >
      {content}
    </Message>
  )
}

Document.serialize = serialize
