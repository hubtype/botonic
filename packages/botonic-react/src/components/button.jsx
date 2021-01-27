import { INPUT, params2queryString } from '@botonic/core'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import { COLORS, WEBCHAT } from '../constants'
import { WebchatContext } from '../contexts'
import { strToBool } from '../util/objects'
import { renderComponent } from '../util/react'
import { ButtonsDisabler } from '../util/webchat'

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
  let {
    buttonsAutoDisable,
    buttonsDisabledStyle,
  } = ButtonsDisabler.getPropertiesFromTheme(webchatState.theme)
  buttonsAutoDisable =
    props.autodisable !== undefined ? props.autodisable : buttonsAutoDisable
  buttonsDisabledStyle =
    props.disabledstyle !== undefined
      ? props.disabledstyle
      : buttonsDisabledStyle
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
    if (props.setDisabled) {
      props.setDisabled(true)
      const messageToUpdate = webchatState.messagesJSON.filter(
        m => m.id == props.parentId
      )[0]
      if (messageToUpdate.type === INPUT.CAROUSEL) {
        messageToUpdate.data.elements = messageToUpdate.data.elements.map(
          e => ({
            ...e,
            ...{
              buttons: e.buttons.map(b => {
                return {
                  ...b,
                  ...{
                    disabled: true,
                    autodisable:
                      b.autodisable !== undefined
                        ? b.autodisable
                        : buttonsAutoDisable,
                    disabledstyle:
                      b.disabledstyle !== undefined
                        ? b.disabledstyle
                        : buttonsDisabledStyle,
                  },
                }
              }),
            },
          })
        )
        updateMessage(messageToUpdate)
      } else {
        const updatedMsg = {
          ...messageToUpdate,
          ...{
            buttons: messageToUpdate.buttons.map(b => {
              return {
                ...b,
                ...{
                  disabled: true,
                  autodisable:
                    b.autodisable !== undefined
                      ? b.autodisable
                      : buttonsAutoDisable,
                  disabledstyle:
                    b.disabledstyle !== undefined
                      ? b.disabledstyle
                      : buttonsDisabledStyle,
                },
              }
            }),
          },
        }
        updateMessage(updatedMsg)
      }
    }
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
          ...(props.disabled &&
            buttonsAutoDisable && {
              ...WEBCHAT.DEFAULTS.BUTTON_DISABLED_STYLE,
              ...buttonsDisabledStyle,
            }),
        }}
        bottom={props.bottomRadius}
      >
        {props.children}
      </StyledButton>
    )
  }

  const renderNode = () => {
    const disabledProps = {}
    if (props.autodisable !== undefined)
      disabledProps.autodisable = String(props.autodisable)
    if (props.disabledstyle !== undefined)
      disabledProps.disabledstyle = JSON.stringify(props.disabledstyle)
    if (props.webview) {
      const Webview = props.webview
      let params = ''
      if (props.params) params = params2queryString(props.params)
      return (
        <button url={`/webviews/${Webview.name}?${params}`} {...disabledProps}>
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
      disabled: buttonProps.disabled,
      autodisable: buttonProps.autodisable,
      disabledstyle: buttonProps.disabledstyle,
    },
  }
}
