import React from 'react'

import { Message } from './message'
import { isBrowser } from '@botonic/core'

export const Image = props => {
  let content = props.children
  if (isBrowser())
    content = (
      <img
        style={{
          borderRadius: '8px',
          maxWidth: '150px',
          maxHeight: '150px',
          margin: '10px'
        }}
        src={props.src}
      />
    )
  return (
    <Message {...props} type='image'>
      {content}
    </Message>
  )
}
