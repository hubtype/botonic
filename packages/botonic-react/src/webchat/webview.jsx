import React, { useContext, useEffect } from 'react'
import Frame from 'react-frame-component'
import { RequestContext, WebchatContext } from '../contexts'
import styled from 'styled-components'

const WebviewHeaderStyled = styled.div`
  textalign: right;
  backgroundcolor: #f4f4f4;
  bordertop: 1px solid rgba(0, 0, 0, 0.2);
  borderbottom: 1px solid rgba(0, 0, 0, 0.2);
`
const WebviewHeaderLogo = styled.div`
  display: inline-block;
  padding: 8px 12px;
  cursor: pointer;
`
const WebViewContainerStyled = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 80%;
  background-color: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
`
const WebviewContentStyled = styled.div`
  flex: 1;
  overflow: auto;
`

export const WebviewHeader = props => {
  const { closeWebview } = useContext(RequestContext)
  return (
    <WebviewHeaderStyled>
      <WebviewHeaderLogo onClick={closeWebview}>✕</WebviewHeaderLogo>
    </WebviewHeaderStyled>
  )
}

export const WebviewContainer = props => {
  console.log(props.style)
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
    <div style={{ ...props.style }}>
      <WebViewContainerStyled>
        <WebviewHeader style={{ flex: 'none' }} />
        <WebviewContentStyled>
          {typeof Webview === 'string' ? (
            <iframe
              src={Webview}
              style={{
                borderStyle: 'none',
                width: '100%',
                height: '100%'
              }}
            />
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
        </WebviewContentStyled>
      </WebViewContainerStyled>
    </div>
  )
}
