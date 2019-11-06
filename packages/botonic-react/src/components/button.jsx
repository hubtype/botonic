import React, { useContext, useState } from 'react'

import { isBrowser, isNode, params2queryString } from '@botonic/core'
import { WebchatContext } from '../contexts'

export const Button = props => {
  const {
    webchatState,
    openWebview,
    sendPayload,
    getThemeProperty,
  } = useContext(WebchatContext)
  const [hover, setHover] = useState(false)
  const { theme } = webchatState

  const handleClick = event => {
    event.preventDefault()
    if (props.webview) openWebview(props.webview, props.params)
    else if (props.path) sendPayload(`__PATH_PAYLOAD__${props.path}`)
    else if (props.payload) sendPayload(props.payload)
    else if (props.url) {
      window.open(props.url)
    }
    if (props.onClick) props.onClick()
  }

  const renderBrowser = () => {
    let buttonStyle = getThemeProperty('button.style')
    let CustomButton = getThemeProperty('button.custom')
    if (CustomButton) {
      return (
        <div onClick={e => handleClick(e)}>
          <CustomButton>{props.children}</CustomButton>
        </div>
      )
    }
    return (
      <button
        theme={theme}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={e => handleClick(e)}
        style={{
          display: 'flex',
          width: '100%',
          maxHeight: 80,
          fontSize: 14,
          textAlign: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          padding: '12px 32px',
          color: getThemeProperty('brand.color', '#000'),
          backgroundColor: hover
            ? getThemeProperty('button.style.hover', '#f3f3f3')
            : getThemeProperty('button.style.background', '#fff'),
          border: 'none',
          border: '1px solid #f1f0f0',
          cursor: 'pointer',
          outline: 0,
          borderTopRightRadius: props.top || 0,
          borderTopLeftRadius: props.top || 0,
          borderBottomRightRadius: props.bottom || 0,
          borderBottomLeftRadius: props.bottom || 0,
          overflow: 'hidden',
          ...buttonStyle,
        }}
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
      title: buttonProps.children,
    },
  }
}
