import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'

import { COLORS, ROLES, WEBCHAT } from '../constants'
import { WebviewRequestContext } from '../contexts'
import { WebchatContext } from '../webchat/context'

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

const FrameStyles = `
  border-style: none;
  width: 100%;
  height: 100%;
`

const StyledFrame = styled.iframe`
  ${FrameStyles}
`

const StyledFrameAsDiv = styled.div`
  ${FrameStyles}
`

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

  const close = async e => {
    if (e.data === 'botonicCloseWebview') {
      await closeWebview()
    }
  }

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
          <StyledFrameAsDiv>
            <Webview />
          </StyledFrameAsDiv>
        )}
      </StyledWebviewContent>
    </StyledWebview>
  )
}
