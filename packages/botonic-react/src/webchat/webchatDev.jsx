import React from 'react'
import { useWebchat } from './hooks'
import { Webchat } from './webchat'

export const WebchatDev = props => {
  const webchatHooks = useWebchat()
  const { webchatState } = webchatHooks

  return (
    <div>
      <Webchat {...props} webchatHooks={webchatHooks} />
    </div>
  )
}
