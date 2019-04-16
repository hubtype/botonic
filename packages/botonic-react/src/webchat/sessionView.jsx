import { JSONEditor } from 'react-json-editor-viewer'
import React from 'react'

import { useWebchat } from './hooks'

export const SessionView = props => {
  const { webchatState, updateSession } = props.webchatHooks || useWebchat()
  const updateSessionTest = (props, value, parent, data) => {
    updateSession(data)
  }
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
      <JSONEditor
        data={webchatState.session}
        collapsible
        onChange={updateSessionTest}
      />
    </div>
  )
}
