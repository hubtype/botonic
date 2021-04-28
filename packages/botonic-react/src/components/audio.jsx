import { INPUT, isBrowser } from '@botonic/core'
import React from 'react'

import { ROLES } from '../constants'
import { Message } from './message'

const serialize = audioProps => {
  return { src: audioProps.src }
}

export const Audio = props => {
  let content = props.children
  if (isBrowser())
    content = [
      <audio
        key={Math.random()}
        style={{ maxWidth: '100%' }}
        id='myAudio'
        controls
      >
        <source src={props.src} type='audio/mpeg' />
        Your browser does not support this audio format.
      </audio>,
      props.children,
    ]
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
