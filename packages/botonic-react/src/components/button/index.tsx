import { INPUT } from '@botonic/core'
import React, { useContext } from 'react'

import { isInWebviewApp, resolveImage } from '../../util/environment'
import { renderComponent } from '../../util/react'
import { generateWebviewUrlWithParams } from '../../util/webviews'
import { WebchatContext } from '../../webchat/context'
import { ButtonsDisabler } from '../buttons-disabler'
import { COMPONENT_DISPLAY_NAMES } from '../constants'
import { ButtonProps } from '../index-types'
import { StyledButton, StyledUrlImage } from './styles'

export const Button = (props: ButtonProps) => {
  const { webchatState, openWebview, sendPayload, sendInput, updateMessage } =
    useContext(WebchatContext)

  const autoDisable =
    webchatState.theme?.button?.autodisable || props.autodisable

  const handleClick = event => {
    event.preventDefault()

    const type = webchatState.theme?.button?.messageType

    if (props.webview) {
      openWebview(props.webview, props.params)
    } else if (props.path) {
      type === INPUT.POSTBACK
        ? sendPayload(`__PATH_PAYLOAD__${props.path}`)
        : sendInput({
            type: INPUT.TEXT,
            data: String(props.children),
            text: String(props.children),
            payload: `__PATH_PAYLOAD__${props.path}`,
          })
    } else if (props.payload) {
      type === INPUT.POSTBACK
        ? sendPayload(props.payload)
        : sendInput({
            type: INPUT.TEXT,
            data: String(props.children),
            text: String(props.children),
            payload: props.payload,
          })
    } else if (props.url) {
      const defaultTarget = isInWebviewApp() ? '_self' : '_blank'
      window.open(props.url, props.target || defaultTarget)
    }

    if (props.onClick) {
      props.onClick()
    }

    if (props.setDisabled) {
      props.setDisabled(true)
      const messageToUpdate = webchatState.messagesJSON.filter(
        m => m.id === props.parentId
      )[0]
      const updatedMsg = ButtonsDisabler.getUpdatedMessage(messageToUpdate)
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
    const themeButton = webchatState.theme.button
    const urlIconEnabledProp = themeButton?.urlIcon?.enable
    const urlIconImage = themeButton?.urlIcon?.image
    const urlIcon = urlIconEnabledProp ? urlIconImage : undefined

    const CustomButton = themeButton?.custom

    if (CustomButton) {
      return (
        <div className={getClassName(true)} onClick={e => handleClick(e)}>
          <CustomButton>{props.children}</CustomButton>
        </div>
      )
    }

    return (
      <StyledButton
        className={getClassName()}
        onClick={e => handleClick(e)}
        disabled={props.disabled && autoDisable}
      >
        {props.children}
        {props.url && urlIcon && (
          <StyledUrlImage
            className='botonic-url-icon'
            src={resolveImage(urlIcon)}
          />
        )}
      </StyledButton>
    )
  }

  const renderNode = () => {
    const disabledProps = ButtonsDisabler.constructNodeProps({
      disabled: props.disabled,
      disabledstyle: props.disabledstyle,
      autodisable: props.autodisable,
    })
    if (props.webview) {
      return (
        <button
          // @ts-ignore
          // eslint-disable-next-line react/no-unknown-property
          url={generateWebviewUrlWithParams(props.webview, props.params)}
          {...disabledProps}
        >
          {props.children}
        </button>
      )
    }

    if (props.path) {
      const payload = `__PATH_PAYLOAD__${props.path}`
      return (
        // @ts-ignore
        // eslint-disable-next-line react/no-unknown-property
        <button payload={payload} {...disabledProps}>
          {props.children}
        </button>
      )
    }

    if (props.payload) {
      return (
        // @ts-ignore
        // eslint-disable-next-line react/no-unknown-property
        <button payload={props.payload} {...disabledProps}>
          {props.children}
        </button>
      )
    }

    if (props.url) {
      return (
        // @ts-ignore
        // eslint-disable-next-line react/no-unknown-property
        <button url={props.url} target={props.target} {...disabledProps}>
          {props.children}
        </button>
      )
    }

    if (props.onClick) {
      return null
    }
    console.log('Button props', props)
    throw new Error('Button missing payload, path, webview, url or onClick')
  }

  return renderComponent({ renderBrowser, renderNode })
}

Button.displayName = COMPONENT_DISPLAY_NAMES.Button

Button.serialize = (buttonProps: ButtonProps) => {
  const payload = buttonProps.path
    ? `__PATH_PAYLOAD__${buttonProps.path}`
    : buttonProps.payload

  console.log('Button serialize', {
    payload,
    url: buttonProps.url,
    target: buttonProps.target,
    webview: buttonProps.webview && String(buttonProps.webview),
    title: buttonProps.children && String(buttonProps.children),
    ...ButtonsDisabler.withDisabledProps(buttonProps),
  })

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
