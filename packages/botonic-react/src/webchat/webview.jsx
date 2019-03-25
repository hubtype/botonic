import React, { useContext } from 'react'
import { RequestContext, WebchatContext } from '../contexts'

export const WebviewHeader = props => {
  const { closeWebview } = useContext(RequestContext)
  return (
    <div
      style={{
        textAlign: 'right',
        backgroundColor: '#f4f4f4',
        borderTop: '1px solid rgba(0, 0, 0, 0.2)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.2)'
      }}
    >
      <div
        style={{
          display: 'inline-block',
          padding: '8px 12px',
          cursor: 'pointer'
        }}
        onClick={closeWebview}
      >
        ✕
      </div>
    </div>
  )
}

export const WebviewContainer = props => {
  const { webchatState } = useContext(WebchatContext)
  let Webview = webchatState.webview

  return (
    <div style={{ ...props.style }}>
      <div
        style={{
          ...(props.style || {}),
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          bottom: 0,
          width: '100%',
          height: '80%',
          backgroundColor: '#fff'
        }}
      >
        <WebviewHeader style={{ flex: 'none' }} />
        <div
          style={{
            flex: 1,
            overflow: 'auto'
          }}
        >
          <Webview />
        </div>
      </div>
    </div>
  )
}
