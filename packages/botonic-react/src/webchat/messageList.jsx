import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'
import { staticAsset } from '../utils'

export const WebchatMessageList = props => {
  const { webchatState, useTheme } = useContext(WebchatContext)
  const { theme } = webchatState
  const CustomIntro = useTheme('intro.custom')
  const introImage = useTheme('intro.image')
  const introStyle = useTheme('intro.style')
  const DefaultIntro = (
    <img
      style={{
        maxHeight: '50%',
        ...(introStyle || {})
      }}
      src={introImage && staticAsset(introImage)}
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
