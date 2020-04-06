import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import { isBrowser, isNode, params2queryString } from '@botonic/core'
import { WebchatContext } from '../contexts'
import { COLORS } from '../constants'
import { renderComponent } from '../utils'

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
    const type = getThemeProperty('button.messageType', 'postback')
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
    const buttonStyle = getThemeProperty('button.style')
    const CustomButton = getThemeProperty('button.custom')
    if (CustomButton) {
      return (
        <div onClick={e => handleClick(e)}>
          <CustomButton>{props.children}</CustomButton>
        </div>
      )
    }

    const buttonBgColor = hover
      ? getThemeProperty('button.hoverBackground', COLORS.CONCRETE_WHITE)
      : getThemeProperty('button.style.background', COLORS.SOLID_WHITE)
    const buttonTextColor = hover
      ? getThemeProperty('button.hoverText', COLORS.SOLID_BLACK)
      : getThemeProperty('button.style.color', COLORS.SOLID_BLACK)

    return (
      <StyledButton
        theme={theme}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={e => handleClick(e)}
        style={{
          color: getThemeProperty('brand.color', COLORS.SOLID_BLACK),
          ...buttonStyle,
          color: buttonTextColor,
          backgroundColor: buttonBgColor,
        }}
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
      return <button url={props.url}>{props.children}</button>
    }
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
      webview: buttonProps.webview && String(buttonProps.webview),
      title: buttonProps.children && String(buttonProps.children),
    },
  }
}
