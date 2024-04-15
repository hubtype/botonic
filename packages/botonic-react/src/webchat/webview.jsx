import React, { useContext, useEffect } from 'react'
import Frame from 'react-frame-component'
import styled from 'styled-components'

import { COLORS, ROLES, WEBCHAT } from '../constants'
import { WebchatContext, WebviewRequestContext } from '../contexts'

const StyledWebview = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: ${COLORS.SOLID_WHITE};
  z-index: 2;
  border-radius: ${WEBCHAT.DEFAULTS.BORDER_RADIUS_TOP_CORNERS};
`

const StyledWebviewHeader = styled.div`
  text-align: right;
  background-color: ${COLORS.WILD_SAND_WHITE};
  border-top: 1px solid ${COLORS.SOLID_BLACK_ALPHA_0_2};
  border-bottom: 1px solid ${COLORS.SOLID_BLACK_ALPHA_0_2};
  border-radius: ${WEBCHAT.DEFAULTS.BORDER_RADIUS_TOP_CORNERS};
`
const StyledCloseHeader = styled.div`
  display: inline-block;
  padding: 8px 12px;
  cursor: pointer;
`

const StyledWebviewContent = styled.div`
  flex: 1;
  overflow: auto;
`

const StyledFrame = styled.iframe`
  border-style: none;
  width: 100%;
  height: 100%;
`

const WebviewMode = props => {
  /*
    Default mode is with divs.
    Setting the prop "asframe" will render the webview inside an iframe.
    Pros and Cons of this "asframe" mode are:
    Pros: OAuth2 flows can be tested locally with an iframe.
    Cons: We won't be able to visualize correctly css styles in botonic serve (although styles will work in production).
   */

  const style = {
    borderStyle: 'none',
    width: '100%',
    height: '100%',
  }
  if (props.asframe) {
    return <Frame style={style}>{props.children}</Frame>
  }
  return <div style={style}>{props.children}</div>
}

export const WebviewHeader = () => {
  const { closeWebview } = useContext(WebviewRequestContext)
  const { getThemeProperty } = useContext(WebchatContext)
  return (
    <StyledWebviewHeader
      role={ROLES.WEBVIEW_HEADER}
      style={{
        ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.webviewHeaderStyle),
      }}
    >
      <StyledCloseHeader onClick={closeWebview}>✕</StyledCloseHeader>
    </StyledWebviewHeader>
  )
}

export const WebviewContainer = props => {
  const { webchatState } = useContext(WebchatContext)
  const { closeWebview } = useContext(WebviewRequestContext)
  const Webview = webchatState.webview

  const close = e => e.data === 'botonicCloseWebview' && closeWebview()

  useEffect(() => {
    if (window.addEventListener) {
      window.addEventListener('message', close, false)
    } else if (window.attachEvent) {
      // ie8
      window.attachEvent('onmessage', close)
    }
  }, [])

  return (
    <StyledWebview
      role={ROLES.WEBVIEW}
      style={{
        ...props.style,
      }}
    >
      <WebviewHeader style={{ flex: 'none' }} />
      <StyledWebviewContent>
        {typeof Webview === 'string' ? (
          <StyledFrame src={Webview} />
        ) : (
          <WebviewMode>
            <Webview />
          </WebviewMode>
        )}
      </StyledWebviewContent>
    </StyledWebview>
  )
}
