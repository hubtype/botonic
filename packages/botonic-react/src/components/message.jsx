import React, { useState, useEffect, useContext } from 'react'

import { isBrowser, isNode } from '@botonic/core'
import { WebchatContext, RequestContext } from '../contexts'
import { Button } from './button'
import { Reply } from './reply'

export const Message = props => {
  const { defaultTyping, defaultDelay } = useContext(RequestContext)
  const {
    type = '',
    from = 'bot',
    delay = defaultDelay,
    typing = defaultTyping,
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
      console.log('STRING', textChildren)
      let carousel = []
      let img_url = null
      let new_Child = null
      try {
        textChildren[0].props.children.map((e, i) => {
          let c = e.props.children
          carousel[i] = {
            img: c[0].props.src,
            title: c[1].props.children,
            subtitle: c[2].props.children,
            button: c[3].props
          }
        })
      } catch (e) {}
      if (carousel.length) {
        console.log('CAAAR;', carousel)
        new_Child = carousel
      }
      try {
        if (textChildren[0].type == 'img') img_url = textChildren[0].props.src
      } catch (e) {}
      if (img_url && !carousel.length) new_Child = img_url
      let message = {
        id: state.id,
        type,
        data: new_Child ? new_Child : textChildren,
        from,
        delay,
        typing,
        replies: replies.map(r => ({
          payload: r.props.payload || r.props.path,
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
