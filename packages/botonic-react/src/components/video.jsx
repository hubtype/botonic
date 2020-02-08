import React from 'react'

import { Message } from './message'
import { isBrowser } from '@botonic/core'
import { COLORS } from '../constants'

const serialize = videoProps => {
  return { video: videoProps.src }
}

export const Video = props => {
  let content = props.children
  if (isBrowser())
    content = (
      <video
        style={{
          backgroundColor: COLORS.SOLID_BLACK_ALPHA_0_5,
          borderRadius: '8px',
          maxHeight: '180px',
          maxWidth: '300px',
          margin: '10px',
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
