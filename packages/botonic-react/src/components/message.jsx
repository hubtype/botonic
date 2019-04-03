import React, { useState, useEffect, useContext } from 'react'

import { isBrowser, isNode } from '@botonic/core'
import { WebchatContext } from '../contexts'
import { Button } from './button'
import { Reply } from './reply'

export const Message = props => {
  const {
    type = '',
    from = 'bot',
    delay = 0,
    typing = 0,
    children,
    ...otherProps
  } = props

  const { webchatState, addMessage, updateReplies } = useContext(WebchatContext)
  const [state, setState] = useState({
    id: Math.random()
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
      let message = {
        id: state.id,
        type,
        data: textChildren,
        from,
        delay,
        typing,
        replies: replies.map(r => ({ payload: r.payload, text: r.children })),
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
  const getBgColor = () =>
    isFromUser() ? webchatState.theme.brandColor : '#F1F0F0'

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
          position: 'relative',
          alignSelf: isFromUser() ? 'flex-end' : 'flex-start',
          margin: 8,
          maxWidth: '60%',
          backgroundColor: getBgColor(),
          color: isFromUser() ? '#fff' : '#000',
          fontFamily: 'Arial, Helvetica, sans-serif',
          borderRadius: 8
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
        {isFromUser() && (
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
        {isFromBot() && (
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
      </div>
    )
  }

  const renderNode = () => <message {...props}>{children}</message>

  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}
