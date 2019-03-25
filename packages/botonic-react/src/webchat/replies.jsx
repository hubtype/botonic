import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'

export const WebchatReplies = props => {
  const { webchatState } = useContext(WebchatContext)
  return (
    <div
      style={{
        ...(props.style || {}),
        overflowX: 'auto',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        paddingBottom: 10,
        marginLeft: 5,
        marginRight: 5
      }}
    >
      {webchatState.replies.map((r, i) => (
        <div key={i} style={{ display: 'inline-block', margin: 3 }}>
          {r}
        </div>
      ))}
    </div>
  )
}
