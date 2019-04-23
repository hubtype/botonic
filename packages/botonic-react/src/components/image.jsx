import React from 'react'

import { Message } from './message'
import { isBrowser } from '@botonic/core'

const serialize = imageProps => {
  return { image: imageProps.src }
}

export const Image = props => {
  let content = ''
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
    <Message json={serialize(props)} {...props} type='image'>
      {content}
    </Message>
  )
}

Image.serialize = serialize
