import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'

const options = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
}

export const WebchatReplies = props => {
  const { webchatState } = useContext(WebchatContext)
  let justify = 'center'
  if (props.align) justify = options[props.align]
  if (props.wrap == 'nowrap') justify = 'flex-start'
  return (
    <div
      style={{
        display: 'flex',
        ...(props.style || {}),
        overflowX: 'auto',
        textAlign: 'center',
        justifyContent: justify,
        flexWrap: props.wrap || 'wrap',
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
