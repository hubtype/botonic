import React, { useContext } from 'react'
import styled from 'styled-components'

import { isBrowser, isNode, params2queryString } from '@botonic/core'
import { WebchatContext } from '../contexts'

const StyledButton = styled.button`
  display: flex;
  width: 100%;
  max-height: 80px;
  font-size: 14px;
  text-align: center;
  align-content: center;
  justify-content: center;
  padding: 12px 32px;
  color: ${props => props.theme.brandColor || `#000`};
  border: none;
  border: 1px solid #f1f0f0;
  cursor: pointer;
  outline: 0px;
  border-top-right-radius: ${props => props.borderTop || `0px`};
  border-top-left-radius: ${props => props.borderTop || `0px`};
  border-bottom-right-radius: ${props => props.borderBottom || `0px`};
  border-bottom-left-radius: ${props => props.borderBottom || `0px`};
  &:hover {
    background-color: #f3f3f3;
  }
  overflow: hidden;
`

export const Button = props => {
  const { webchatState, openWebview, sendPayload } = useContext(WebchatContext)

  const handleClick = event => {
    event.preventDefault()
    if (props.webview) openWebview(props.webview, props.params)
    else if (props.path) sendPayload(`__PATH_PAYLOAD__${props.path}`)
    else if (props.payload) sendPayload(props.payload)
    else if (props.url) {
      window.open(props.url)
      props.onClick()
    } else if (props.onClick) props.onClick()
  }

  const renderBrowser = () => {
    if (webchatState.theme.customButton) {
      let CustomButton = webchatState.theme.customButton
      return (
        <div onClick={e => handleClick(e)}>
          <CustomButton>{props.children}</CustomButton>
        </div>
      )
    }
    return (
      <StyledButton
        borderTop={props.top}
        borderBottom={props.bottom}
        theme={webchatState.theme}
        onClick={e => handleClick(e)}
      >
        {props.children}
      </StyledButton>
    )
  }

  const renderNode = () => {
    console.log('hi')
    if (props.webview) {
      let Webview = props.webview
      let params = ''
      if (props.params) params = params2queryString(props.params)
      return (
        <button url={`/webviews/${Webview.name}?${params}`}>
          {props.children}
        </button>
      )
    } else if (props.path) {
      let payload = `__PATH_PAYLOAD__${props.path}`
      return <button payload={payload}>{props.children}</button>
    } else if (props.payload) {
      return <button payload={props.payload}>{props.children}</button>
    } else if (props.url) {
      return <button url={props.url}>{props.children}</button>
    }
  }

  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}

Button.serialize = buttonProps => {
  let payload = buttonProps.payload
  if (buttonProps.path) payload = `__PATH_PAYLOAD__${buttonProps.path}`
  return {
    button: {
      payload,
      url: buttonProps.url,
      webview: buttonProps.webview,
      title: buttonProps.children
    }
  }
}
