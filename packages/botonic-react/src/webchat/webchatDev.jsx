import React from 'react'
import { useWebchat } from './hooks'
import { Webchat } from './webchat'
import { SessionView } from './sessionView'

export const WebchatDev = props => {
  const webchatHooks = useWebchat()
  const { webchatState } = webchatHooks
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Webchat {...props} webchatHooks={webchatHooks} />
      <SessionView webchatHooks={webchatHooks} />
    </div>
  )
}
