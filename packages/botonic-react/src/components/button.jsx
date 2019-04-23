import React, { useContext } from 'react'

import { isBrowser, isNode, params2queryString } from '@botonic/core'
import { WebchatContext } from '../contexts'

export const Button = props => {
  const { webchatState, openWebview, sendPayload } = useContext(WebchatContext)

  const handleClick = event => {
    event.preventDefault()
    if (props.webview) openWebview(props.webview, props.params)
    else if (props.path) sendPayload(`__PATH_PAYLOAD__${props.path}`)
    else if (props.payload) sendPayload(props.payload)
    else if (props.url) window.open(props.url)
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
      <button
        style={{
          width: '100%',
          height: 40,
          border: '1px solid #F1F0F0',
          borderRadius: 8,
          cursor: 'pointer',
          outline: 0
        }}
        onClick={e => handleClick(e)}
      >
        {props.children}
      </button>
    )
  }

  const renderNode = () => {
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
