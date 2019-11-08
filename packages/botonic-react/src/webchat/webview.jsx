import React, { useContext, useEffect } from 'react'
import Frame from 'react-frame-component'
import { RequestContext, WebchatContext } from '../contexts'

export const WebviewHeader = props => {
  const { closeWebview } = useContext(RequestContext)
  const { getThemeProperty } = useContext(WebchatContext)
  return (
    <div
      style={{
        textAlign: 'right',
        backgroundColor: '#f4f4f4',
        borderTop: '1px solid rgba(0, 0, 0, 0.2)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
        ...getThemeProperty('webview.header.style'),
      }}
    >
      <div
        style={{
          display: 'inline-block',
          padding: '8px 12px',
          cursor: 'pointer',
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
  const { closeWebview } = useContext(RequestContext)
  let Webview = webchatState.webview

  let close = e => e.data == 'botonicCloseWebview' && closeWebview()

  useEffect(() => {
    if (window.addEventListener) {
      window.addEventListener('message', close, false)
    } else if (window.attachEvent) {
      // ie8
      window.attachEvent('onmessage', close)
    }
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        bottom: 0,
        width: '100%',
        height: '80%',
        backgroundColor: '#fff',
        ...(props.style || {}),
      }}
    >
      <WebviewHeader style={{ flex: 'none' }} />
      <div
        style={{
          flex: 1,
          overflow: 'auto',
        }}
      >
        {typeof Webview === 'string' ? (
          <iframe
            src={Webview}
            style={{
              borderStyle: 'none',
              width: '100%',
              height: '100%',
            }}
          />
        ) : (
          <Frame
            style={{
              borderStyle: 'none',
              width: '100%',
              height: '100%',
            }}
          >
            <Webview />
          </Frame>
        )}
      </div>
    </div>
  )
}
