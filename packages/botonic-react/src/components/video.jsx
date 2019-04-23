import React from 'react'

import { Message } from './message'
import { isBrowser } from '@botonic/core'

const serialize = videoProps => {
  return { video: videoProps.src }
}

export const Video = props => {
  let content = ''
  if (isBrowser())
    content = (
      <video
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '8px',
          maxHeight: '180px',
          maxWidth: '300px',
          margin: '10px'
        }}
        controls
      >
        <source src={props.src} />
      </video>
    )
  return (
    <Message json={serialize(props)} {...props} type='video'>
      {content}
    </Message>
  )
}

Video.serialize = serialize
