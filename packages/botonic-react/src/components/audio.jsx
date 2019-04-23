import React from 'react'
import { isBrowser } from '@botonic/core'
import { Message } from './message'

const serialize = audioProps => {
  return { audio: audioProps.src }
}

export const Audio = props => {
  let content = ''
  if (isBrowser())
    content = (
      <audio style={{ maxWidth: '100%' }} id='myAudio' controls>
        <source src={props.src} type='audio/mpeg' />
        Your browser does not support this audio format.
      </audio>
    )
  return (
    <Message json={serialize(props)} {...props} type='audio'>
      {content}
    </Message>
  )
}

Audio.serialize = serialize
