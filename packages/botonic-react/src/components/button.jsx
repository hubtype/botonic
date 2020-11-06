import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import { params2queryString, INPUT } from '@botonic/core'
import { WebchatContext } from '../contexts'
import { COLORS, WEBCHAT } from '../constants'
import { renderComponent } from '../util/react'

const StyledButton = styled.button`
  display: flex;
  width: 100%;
  max-height: 80px;
  font-size: 14px;
  text-align: center;
  align-content: center;
  justify-content: center;
  padding: 12px 32px;
  font-family: inherit;
  border: none;
  border: 1px solid ${COLORS.SEASHELL_WHITE};
  cursor: pointer;
  outline: 0;
  border-top-right-radius: ${props => props.top || '0px'};
  border-top-left-radius: ${props => props.top || '0px'};
  border-bottom-right-radius: ${props => props.bottom || '0px'};
  border-bottom-left-radius: ${props => props.bottom || '0px'};
  overflow: hidden;
`

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
    const type = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.buttonMessageType,
      INPUT.TEXT
    )
    if (props.webview) openWebview(props.webview, props.params)
    else if (props.path) {
      type == INPUT.POSTBACK
        ? sendPayload(`__PATH_PAYLOAD__${props.path}`)
        : sendInput({
            type: INPUT.TEXT,
            data: String(props.children),
            payload: `__PATH_PAYLOAD__${props.path}`,
          })
    } else if (props.payload) {
      type == INPUT.POSTBACK
        ? sendPayload(props.payload)
        : sendInput({
            type: INPUT.TEXT,
            data: String(props.children),
            payload: props.payload,
          })
    } else if (props.url) {
      window.open(props.url, props.target || '_blank')
    }
    if (props.onClick) props.onClick()
  }

  const renderBrowser = () => {
    const buttonStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.buttonStyle)
    const CustomButton = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.customButton
    )
    if (CustomButton) {
      return (
        <div onClick={e => handleClick(e)}>
          <CustomButton>{props.children}</CustomButton>
        </div>
      )
    }

    const buttonBgColor = hover
      ? getThemeProperty(
          WEBCHAT.CUSTOM_PROPERTIES.buttonHoverBackground,
          COLORS.CONCRETE_WHITE
        )
      : getThemeProperty(
          WEBCHAT.CUSTOM_PROPERTIES.buttonStyleBackground,
          COLORS.SOLID_WHITE
        )
    const buttonTextColor = hover
      ? getThemeProperty(
          WEBCHAT.CUSTOM_PROPERTIES.buttonHoverTextColor,
          COLORS.SOLID_BLACK
        )
      : getThemeProperty(
          WEBCHAT.CUSTOM_PROPERTIES.buttonStyleColor,
          COLORS.SOLID_BLACK
        )

    return (
      <StyledButton
        theme={theme}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={e => handleClick(e)}
        style={{
          ...buttonStyle,
          color: buttonTextColor,
          backgroundColor: buttonBgColor,
        }}
        bottom={props.bottomRadius}
      >
        {props.children}
      </StyledButton>
    )
  }

  const renderNode = () => {
    if (props.webview) {
      const Webview = props.webview
      let params = ''
      if (props.params) params = params2queryString(props.params)
      return (
        <button url={`/webviews/${Webview.name}?${params}`}>
          {props.children}
        </button>
      )
    } else if (props.path) {
      const payload = `__PATH_PAYLOAD__${props.path}`
      return <button payload={payload}>{props.children}</button>
    } else if (props.payload) {
      return <button payload={props.payload}>{props.children}</button>
    } else if (props.url) {
      return (
        <button url={props.url} target={props.target}>
          {props.children}
        </button>
      )
    }
    throw new Error('Button missing payload, path, webviews or url')
  }

  return renderComponent({ renderBrowser, renderNode })
}

Button.serialize = buttonProps => {
  let payload = buttonProps.payload
  if (buttonProps.path) payload = `__PATH_PAYLOAD__${buttonProps.path}`
  return {
    button: {
      payload,
      url: buttonProps.url,
      target: buttonProps.target,
      webview: buttonProps.webview && String(buttonProps.webview),
      title: buttonProps.children && String(buttonProps.children),
    },
  }
}
