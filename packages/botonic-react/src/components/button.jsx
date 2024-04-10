import { INPUT } from '@botonic/core'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import { COLORS, WEBCHAT } from '../constants'
import { WebchatContext } from '../contexts'
import { renderComponent } from '../util/react'
import { generateWebviewUrlWithParams } from '../util/webviews'
import { ButtonsDisabler } from './buttons-disabler'

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
    updateMessage,
  } = useContext(WebchatContext)
  const [hover, setHover] = useState(false)
  const { theme } = webchatState
  const { autoDisable, disabledStyle } = ButtonsDisabler.resolveDisabling(
    webchatState.theme,
    props
  )
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
            text: String(props.children),
            payload: `__PATH_PAYLOAD__${props.path}`,
          })
    } else if (props.payload) {
      type == INPUT.POSTBACK
        ? sendPayload(props.payload)
        : sendInput({
            type: INPUT.TEXT,
            data: String(props.children),
            text: String(props.children),
            payload: props.payload,
          })
    } else if (props.url) {
      window.open(props.url, props.target || '_blank')
    }
    if (props.onClick) props.onClick()
    if (props.setDisabled) {
      props.setDisabled(true)
      const messageToUpdate = webchatState.messagesJSON.filter(
        m => m.id == props.parentId
      )[0]
      const updatedMsg = ButtonsDisabler.getUpdatedMessage(messageToUpdate, {
        autoDisable,
        disabledStyle,
      })
      updateMessage(updatedMsg)
    }
  }

  const getClassName = (isCustom = false) => {
    if (isCustom) {
      return 'button-custom'
    }
    if (props.payload) {
      return 'button-payload'
    }
    if (props.url) {
      return 'button-url'
    }
    if (props.webview) {
      return 'button-webview'
    }
    if (props.path) {
      return 'button-path'
    }
    return ''
  }

  const renderBrowser = () => {
    const buttonStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.buttonStyle)
    const CustomButton = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.customButton
    )
    if (CustomButton) {
      return (
        <div className={getClassName(true)} onClick={e => handleClick(e)}>
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
        className={getClassName()}
        theme={theme}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={e => handleClick(e)}
        style={{
          ...buttonStyle,
          color: buttonTextColor,
          backgroundColor: buttonBgColor,
          ...(props.disabled && autoDisable && disabledStyle),
        }}
        bottom={props.bottomRadius}
      >
        {props.children}
      </StyledButton>
    )
  }

  const renderNode = () => {
    const disabledProps = ButtonsDisabler.constructNodeProps(props)
    if (props.webview) {
      return (
        <button
          url={generateWebviewUrlWithParams(props.webview, props.params)}
          {...disabledProps}
        >
          {props.children}
        </button>
      )
    } else if (props.path) {
      const payload = `__PATH_PAYLOAD__${props.path}`
      return (
        <button payload={payload} {...disabledProps}>
          {props.children}
        </button>
      )
    } else if (props.payload) {
      return (
        <button payload={props.payload} {...disabledProps}>
          {props.children}
        </button>
      )
    } else if (props.url) {
      return (
        <button url={props.url} target={props.target} {...disabledProps}>
          {props.children}
        </button>
      )
    } else if (props.onClick) {
      return null
    }
    throw new Error('Button missing payload, path, webviews, url or onClick')
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
      ...ButtonsDisabler.withDisabledProps(buttonProps),
    },
  }
}
