import { INPUT, isBrowser } from '@botonic/core'
import React from 'react'

import { ROLES } from '../constants'
import { staticAsset } from '../util/environment'
import { Message } from './message'

const serialize = audioProps => {
  return { audio: audioProps.src }
}

export const Audio = props => {
  props = { ...props, src: staticAsset(props.src) }
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
