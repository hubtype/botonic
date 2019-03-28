import ReactJson from 'react-json-view'
import React from 'react'

import { useWebchat } from './hooks'

export const SessionView = props => {
  const { webchatState, updateSession } = props.webchatHooks || useWebchat()
  return (
    <ReactJson
      style={{ marginLeft: '20px' }}
      onEdit={e => updateSession(e.updated_src)}
      onAdd={e => updateSession(e.updated_src)}
      onDelete={e => updateSession(e.updated_src)}
      theme='apathy:inverted'
      iconStyle='triangle'
      name='Session'
      src={webchatState.session}
    />
  )
}
