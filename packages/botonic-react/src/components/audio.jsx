import React from 'react'
import { isBrowser } from '@botonic/core'
import { Message } from './message'

export const Audio = props => {
  let content = props.children
  if (isBrowser())
    content = (
      <audio style={{ maxWidth: '100%' }} id='myAudio' controls>
        <source src={props.src} type='audio/mpeg' />
        Your browser does not support this audio format.
      </audio>
    )
  return (
    <Message {...props} type='audio'>
      {content}
    </Message>
  )
}
