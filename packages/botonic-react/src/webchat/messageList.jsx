import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'
import { staticAsset } from '../utils'

export const WebchatMessageList = props => {
  const { webchatState } = useContext(WebchatContext)
  const CustomIntro = webchatState.theme && webchatState.theme.customIntro
  const DefaultIntro = webchatState.theme && webchatState.theme.introImage && (
    <img
      style={{
        maxHeight: '50%',
        ...(webchatState.theme.introStyle || {})
      }}
      src={staticAsset(webchatState.theme.introImage)}
    />
  )
  return (
    <div
      style={{
        ...(props.style || {}),
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}
    >
      {CustomIntro ? <CustomIntro /> : DefaultIntro}
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
