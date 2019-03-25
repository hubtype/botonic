import React, { useRef, useEffect, useContext } from 'react'
import { WebchatContext } from '../contexts'

export const WebchatMessageList = props => {
  const messagesEnd = useRef(null)
  const { webchatState } = useContext(WebchatContext)

  useEffect(() => {
    messagesEnd.current.scrollIntoView({ behavior: 'smooth' })
  }, [webchatState.messagesComponents])

  return (
    <div
      style={{
        ...(props.style || {}),
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}
    >
      {webchatState.messagesComponents.map((e, i) => (
        <div
          style={{
            display: 'flex',
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
      <div ref={messagesEnd} />
    </div>
  )
}
