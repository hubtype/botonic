import ReactJson from 'react-json-view'
import React from 'react'

import { useWebchat } from './hooks'

export const SessionView = props => {
  const { webchatState, updateSession } = props.webchatHooks || useWebchat()
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: '#efffff',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          flex: 'none',
          padding: 12,
          fontSize: 12,
          fontWeight: 600
        }}
      >
        PATH:
        <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 6 }}>
          /{webchatState.lastRoutePath}
        </span>
      </div>
      <ReactJson
        style={{ flex: 1, overflow: 'auto' }}
        onEdit={e => updateSession(e.updated_src)}
        onDelete={e => updateSession(e.updated_src)}
        theme='apathy:inverted'
        iconStyle='triangle'
        name='Session'
        src={webchatState.session}
      />
    </div>
  )
}
