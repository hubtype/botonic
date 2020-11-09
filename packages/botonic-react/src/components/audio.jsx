import React from 'react'
import { isBrowser, INPUT } from '@botonic/core'
import { Message } from './message'
import { ROLES } from '../constants'

const serialize = audioProps => {
  return { audio: audioProps.src }
}

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
    <Message
      role={ROLES.AUDIO_MESSAGE}
      json={serialize(props)}
      {...props}
      type={INPUT.AUDIO}
    >
      {content}
    </Message>
  )
}

Audio.serialize = serialize
