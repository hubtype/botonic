import React, { useState, useEffect, useContext } from 'react'
import uuid from 'uuid/v4'
import { isBrowser, isNode } from '@botonic/core'
import { WebchatContext, RequestContext } from '../contexts'
import { Button } from './button'
import { Reply } from './reply'
import Logo from '../webchat/botonic_react_logo100x100.png'
import styled from 'styled-components'

const DefaultMessage = styled.div`
  position: relative;
  margin: 8px;
  font-family: Arial, Helvetica, sans-serif;
  border-radius: 8px;
`

export const Message = props => {
  const { defaultTyping, defaultDelay } = useContext(RequestContext)
  const {
    type = '',
    blob = true,
    from = 'bot',
    delay = defaultDelay,
    typing = defaultTyping,
    children,
    json,
    style,
    ...otherProps
  } = props

  const { webchatState, addMessage, updateReplies } = useContext(WebchatContext)
  const [state, setState] = useState({
    id: props.id || uuid()
  })

  const replies = React.Children.toArray(children).filter(e => e.type === Reply)
  const buttons = React.Children.toArray(children).filter(
    e => e.type === Button
  )
  const textChildren = React.Children.toArray(children).filter(
    e => ![Button, Reply].includes(e.type)
  )
  if (isBrowser()) {
    useEffect(() => {
      let decomposedChildren = json
      let message = {
        id: state.id,
        type,
        data: decomposedChildren ? decomposedChildren : textChildren,
        from,
        buttons: buttons.map(b => ({
          payload: b.props.payload,
          path: b.props.path,
          url: b.props.url,
          title: b.props.children
        })),
        delay,
        typing,
        replies: replies.map(r => ({
          payload: r.props.payload,
          path: r.props.path,
          url: r.props.url,
          text: r.props.children
        })),
        display: delay + typing == 0
      }
      addMessage(message)
    }, [])

    useEffect(() => {
      let msg = webchatState.messagesJSON.find(m => m.id === state.id)
      if (
        msg &&
        msg.display &&
        webchatState.messagesJSON.filter(m => !m.display).length == 0
      ) {
        updateReplies(replies)
      }
    }, [webchatState.messagesJSON])
  }

  const isFromUser = () => from === 'user'
  const isFromBot = () => from === 'bot'
  const getBgColor = () => {
    if (!blob) return 'transparent'
    return isFromUser() ? webchatState.theme.brandColor : '#F1F0F0'
  }

  const getFontColor = colors => {
    if (isFromUser()) {
      if (webchatState.theme.customUserMessages.color) {
        return webchatState.theme.customUserMessages.color
      } else {
        return '#ffffff'
      }
    } else {
      if (webchatState.theme.customBotMessages.color) {
        return webchatState.theme.customBotMessages.color
      } else {
        return '#000'
      }
    }
  }

  const renderBrowser = () => {
    let m = webchatState.messagesJSON.find(m => m.id === state.id)
    if (!m || !m.display) return <></>
    let pointerSize = 6
    let pointerStyles = {
      position: 'absolute',
      top: '50%',
      width: 0,
      height: 0,
      border: `${pointerSize}px solid transparent`,
      marginTop: -pointerSize
    }
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: isFromUser() ? 'flex-end' : 'flex-start',
          position: 'relative',
          paddingLeft: 5
        }}
      >
        <div style={{ width: 30, position: 'absolute', bottom: 0 }}>
          {isFromBot() && webchatState.theme.botLogoChat ? (
            <webchatState.theme.botLogoChat />
          ) : (
            isFromBot() && <img style={{ width: 30 }} src={Logo} />
          )}
        </div>

        <DefaultMessage
          style={{
            width: 30,
            position: 'absolute',
            height: '108%',
            left: isFromBot() ? 30 : 0,
            top: isFromBot() ? 5 : 0,
            backgroundColor: getBgColor(),
            color:
              webchatState.theme.customUserMessages ||
              webchatState.theme.customBotMessages
                ? getFontColor(webchatState.theme)
                : isFromUser()
                ? '#FFFFFF'
                : '#000',
            border: `1px solid ${getBgColor()}`,
            borderRadius: webchatState.theme.customUserMessages
              ? webchatState.theme.customUserMessages.borderRadius
              : '',
            maxWidth: blob ? '60%' : 'calc(100% - 16px)',
            ...style
          }}
          {...otherProps}
        >
          <div
            style={{
              padding: '8px 12px',
              display: 'flex',
              flexDirection: 'column',
              whiteSpace: 'pre-line'
            }}
          >
            {textChildren}
          </div>
          {buttons}
          {isFromUser() && blob && (
            <div
              style={{
                ...pointerStyles,
                right: 0,
                borderRight: 0,
                borderLeftColor: getBgColor(),
                marginRight: -pointerSize
              }}
            />
          )}
          {isFromBot() && blob && (
            <div
              style={{
                ...pointerStyles,
                left: 0,
                borderLeft: 0,
                borderRightColor: getBgColor(),
                marginLeft: -pointerSize
              }}
            />
          )}
        </DefaultMessage>
      </div>
    )
  }

  let { blob: _blob, json: _json, ...nodeProps } = props
  const renderNode = () => <message {...nodeProps}>{children}</message>

  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}
