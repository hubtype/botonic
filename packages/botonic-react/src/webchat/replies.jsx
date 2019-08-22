import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'

const alignOptions = /^left$|^center$|^right$/
const wrapOptions = /^wrap$|^no-wrap$/

export const WebchatReplies = props => {
  const { webchatState } = useContext(WebchatContext)
  return (
    <div
      style={{
        ...(props.style || {}),
        overflowX: 'auto',
        textAlign: (props.align && props.align.match(alignOptions)) || 'center',
        whiteSpace: (props.wrap && props.wrap.match(wrapOptions)) || 'wrap',
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
