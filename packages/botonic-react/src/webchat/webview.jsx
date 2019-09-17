import React, { useContext, useEffect } from 'react'
import Frame from 'react-frame-component'
import { RequestContext, WebchatContext } from '../contexts'
import styled from 'styled-components'

const StyledWebviewContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 0;
  width: 100%;
  height: 80%;
  background-color: #fff;
`

const StyledWebviewHeader = styled.div`
  text-align: right;
  background-color: #f4f4f4;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`

const StyledHeaderButton = styled.div`
  display: inline-block;
  padding: 8px 12px;
  cursor: pointer;
`

const StyledIframe = styled.iframe`
  border-style: none;
  width: 100%;
  height: 100%;
`

const StyledWebviewContent = styled.div`
  flex: 1;
  overflow: auto;
`

export const WebviewHeader = props => {
  const { closeWebview } = useContext(RequestContext)
  return (
    <StyledWebviewHeader>
      <StyledHeaderButton onClick={closeWebview}>✕</StyledHeaderButton>
    </StyledWebviewHeader>
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
    <StyledWebviewContainer
      style={{
        ...(props.style || {})
      }}
    >
      <WebviewHeader style={{ flex: 'none' }} />
      <StyledWebviewContent>
        {typeof Webview === 'string' ? (
          <StyledIframe src={Webview} />
        ) : (
          <Frame
            style={{
              borderStyle: 'none',
              width: '100%',
              height: '100%'
            }}
          >
            <Webview />
          </Frame>
        )}
      </StyledWebviewContent>
    </StyledWebviewContainer>
  )
}
