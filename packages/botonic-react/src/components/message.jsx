import React, { useState, useEffect, useContext } from 'react'
import uuid from 'uuid/v4'
import { isBrowser, isNode } from '@botonic/core'
import { staticAsset } from '../utils'
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
const TextMessage = styled.div`
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  white-space: pre-line;
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

  const getMessageStyle = () =>
    isFromBot()
      ? webchatState.theme.botMessageStyle || {}
      : webchatState.theme.userMessageStyle || {}

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

    let BotMessageImage = Logo
    if ('brandImage' in webchatState.theme)
      BotMessageImage = webchatState.theme.brandImage
    if ('botMessageImage' in webchatState.theme)
      BotMessageImage = webchatState.theme.botMessageImage
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: isFromUser() ? 'flex-end' : 'flex-start',
          position: 'relative',
          paddingLeft: 5
        }}
      >
        {isFromBot() && BotMessageImage && (
          <div
            style={{
              width: 28,
              padding: 4,
              flex: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img style={{ width: '100%' }} src={staticAsset(BotMessageImage)} />
          </div>
        )}

        <DefaultMessage
          style={{
            backgroundColor: getBgColor(),
            color: isFromUser() ? '#FFF' : '#000',
            border: `1px solid ${getBgColor()}`,
            maxWidth: blob ? '60%' : 'calc(100% - 16px)',
            ...getMessageStyle(),
            ...style
          }}
          {...otherProps}
        >
          <TextMessage>{textChildren}</TextMessage>
          {buttons}
          {isFromUser() && blob && (
            <div
              style={{
                ...pointerStyles,
                borderLeftColor: getBgColor(),
                right: 0,
                borderRight: 0,
                marginRight: -pointerSize
              }}
            />
          )}
          {isFromBot() && blob && (
            <div
              style={{
                ...pointerStyles,
                borderRightColor: getBgColor(),
                left: 0,
                borderLeft: 0,
                marginLeft: -pointerSize
              }}
            />
          )}
        </DefaultMessage>
      </div>
    )
  }

  let { blob: _blob, json: _json, ...nodeProps } = props
  const renderNode = () =>
    type === 'custom' ? (
      <message json={JSON.stringify(_json)} {...nodeProps} />
    ) : (
      <message {...nodeProps}>{children}</message>
    )

  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}
