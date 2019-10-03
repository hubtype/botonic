import React, { useRef, useEffect, useContext } from 'react'
import { WebchatContext } from '../contexts'

export const WebchatMessageList = props => {
  const { webchatState } = useContext(WebchatContext)
  return (
    <div
      style={{
        ...(props.style || {}),
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}
    >
      {webchatState.theme.introImage && <webchatState.theme.introImage />}
      {webchatState.messagesComponents.map((e, i) => (
        <div
          style={{
            display: 'flex',
            overflowX: 'hidden',
            flexDirection: 'column',
            flex: 'none',
            whiteSpace: 'pre',
            wordWrap: 'break-word'
          }}
          key={i}
        >
          {e}
        </div>
      ))}
      {props.children}
    </div>
  )
}
