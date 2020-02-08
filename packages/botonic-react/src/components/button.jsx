import React, { useContext, useState } from 'react'

import { isBrowser, isNode, params2queryString } from '@botonic/core'
import { WebchatContext } from '../contexts'
import { COLORS } from '../constants'

export const Button = props => {
  const {
    webchatState,
    openWebview,
    sendPayload,
    sendInput,
    getThemeProperty,
  } = useContext(WebchatContext)
  const [hover, setHover] = useState(false)
  const { theme } = webchatState

  const handleClick = event => {
    event.preventDefault()
    let type = getThemeProperty('button.messageType', 'postback')
    if (props.webview) openWebview(props.webview, props.params)
    else if (props.path) {
      type == 'postback'
        ? sendPayload(`__PATH_PAYLOAD__${props.path}`)
        : sendInput({
            type: 'text',
            data: String(props.children),
            payload: `__PATH_PAYLOAD__${props.path}`,
          })
    } else if (props.payload) {
      type == 'postback'
        ? sendPayload(props.payload)
        : sendInput({
            type: 'text',
            data: String(props.children),
            payload: props.payload,
          })
    } else if (props.url) {
      window.open(props.url)
    }
    if (props.onClick) props.onClick()
  }

  const renderBrowser = () => {
    let buttonStyle = getThemeProperty('button.style', {})
    let CustomButton = getThemeProperty('button.custom', undefined)
    if (CustomButton) {
      return (
        <div onClick={e => handleClick(e)}>
          <CustomButton>{props.children}</CustomButton>
        </div>
      )
    }

    let buttonBgColor = hover
      ? getThemeProperty('button.hoverBackground', COLORS.CONCRETE_WHITE)
      : getThemeProperty('button.style.background', COLORS.SOLID_WHITE)
    let buttonTextColor = hover
      ? getThemeProperty('button.hoverText', COLORS.SOLID_BLACK)
      : getThemeProperty('button.style.color', COLORS.SOLID_BLACK)

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
          color: getThemeProperty('brand.color', COLORS.SOLID_BLACK),
          fontFamily: 'inherit',
          border: 'none',
          border: `1px solid ${COLORS.SEASHELL_WHITE}`,
          cursor: 'pointer',
          outline: 0,
          borderTopRightRadius: props.top || 0,
          borderTopLeftRadius: props.top || 0,
          borderBottomRightRadius: props.bottom || 0,
          borderBottomLeftRadius: props.bottom || 0,
          overflow: 'hidden',
          ...buttonStyle,
          color: buttonTextColor,
          backgroundColor: buttonBgColor,
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
      webview: buttonProps.webview && String(buttonProps.webview),
      title: buttonProps.children && String(buttonProps.children),
    },
  }
}
