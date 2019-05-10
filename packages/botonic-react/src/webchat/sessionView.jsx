import React from 'react'
import JSONTree from 'react-json-tree'

import { useWebchat } from './hooks'

export const SessionView = props => {
  const { webchatState } = props.webchatHooks || useWebchat()
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: '#002B35',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          flex: 'none',
          padding: 12,
          paddingBottom: 0,
          fontSize: 12,
          fontWeight: 600,
          color: 'white'
        }}
      >
        PATH:
        <span
          style={{
            fontSize: 16,
            fontWeight: 400,
            marginLeft: 6,
            color: 'rgb(38, 139, 210)'
          }}
        >
          /{webchatState.lastRoutePath}
        </span>
        <div style={{ marginTop: 16 }}>SESSION:</div>
      </div>
      <JSONTree data={webchatState.session} hideRoot={true} />
    </div>
  )
}
