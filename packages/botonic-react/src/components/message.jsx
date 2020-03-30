import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import uuid from 'uuid/v4'
import { isBrowser, isNode } from '@botonic/core'
import { staticAsset, ConditionalWrapper, renderComponent } from '../utils'
import { WebchatContext, RequestContext } from '../contexts'
import { Button } from './button'
import { Reply } from './reply'
import { WEBCHAT, COLORS } from '../constants'
import Fade from 'react-reveal/Fade'
import moment from 'moment'

const MessageContainer = styled.div`
  display: flex;
  justify-content: ${props => (props.isfromuser ? 'flex-end' : 'flex-start')};
  position: relative;
  padding-left: 5px;
`

const BotMessageImageContainer = styled.div`
  width: 28px;
  padding: 12px 4px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Blob = styled.div`
  position: relative;
  margin: 8px;
  border-radius: 8px;
  background-color: ${props => props.bgcolor};
  color: ${props => props.color};
  max-width: ${props =>
    props.blob
      ? props.blobWidth
        ? props.blobWidth
        : '60%'
      : 'calc(100% - 16px)'};
`

const BlobText = styled.div`
  padding: ${props => (props.blob ? '8px 12px' : '0px')};
  display: flex;
  flex-direction: column;
  white-space: pre-line;
`

const TimestampContainer = styled.div`
  display: flex;
  position: relative;
  align-items: flex-start;
`

const TimestampText = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Lato');
  font-family: Lato;
  font-size: 12px;
  color: ${COLORS.SOLID_BLACK};
  width: 100%;
  text-align: ${props => (props.isfromuser ? 'right' : 'left')};
  padding: ${props => (props.isfromuser ? '0px 15px' : '0px 50px')};
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
    imageStyle,
    timestamps = true,
    ...otherProps
  } = props

  const {
    webchatState,
    addMessage,
    updateReplies,
    getThemeProperty,
  } = useContext(WebchatContext)
  const [state, setState] = useState({
    id: props.id || uuid(),
  })

  const replies = React.Children.toArray(children).filter(e => e.type === Reply)
  const buttons = React.Children.toArray(children).filter(
    e => e.type === Button
  )
  const textChildren = React.Children.toArray(children).filter(
    e => ![Button, Reply].includes(e.type)
  )

  const getTimestampLocale = getThemeProperty(`message.timestamps.locale`, 'en')
  moment.locale(getTimestampLocale)

  const getTimestampFormat = getThemeProperty(
    `message.timestamps.format`,
    false
  )

  if (isBrowser()) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const decomposedChildren = json
      const message = {
        id: state.id,
        type,
        data: decomposedChildren ? decomposedChildren : textChildren,
        timestamp: moment().format(getTimestampFormat),
        from,
        buttons: buttons.map(b => ({
          payload: b.props.payload,
          path: b.props.path,
          url: b.props.url,
          webview: b.props.webview && String(b.props.webview),
          title: b.props.children,
        })),
        delay,
        typing,
        replies: replies.map(r => ({
          payload: r.props.payload,
          path: r.props.path,
          url: r.props.url,
          text: r.props.children,
        })),
        display: delay + typing == 0,
      }
      addMessage(message)
    }, [])

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const msg = webchatState.messagesJSON.find(m => m.id === state.id)
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
    if (!blob) return COLORS.TRANSPARENT
    return isFromUser()
      ? getThemeProperty('brand.color', COLORS.BOTONIC_BLUE)
      : COLORS.SEASHELL_WHITE
  }

  const getMessageStyle = () =>
    isFromBot()
      ? getThemeProperty('message.bot.style')
      : getThemeProperty('message.user.style')

  const getBlobTick = () => getThemeProperty(`message.${from}.blobTick`, true)

  const renderBrowser = () => {
    const m = webchatState.messagesJSON.find(m => m.id === state.id)
    if (!m || !m.display) return <></>
    const pointerSize = 6
    const pointerStyles = {
      position: 'absolute',
      top: '50%',
      width: 0,
      height: 0,
      border: `${pointerSize}px solid ${COLORS.TRANSPARENT}`,
      marginTop: -pointerSize,
    }

    const BotMessageImage = getThemeProperty(
      'message.bot.image',
      getThemeProperty('brand.image', WEBCHAT.DEFAULTS.LOGO)
    )
    const animationsEnabled = getThemeProperty('animations.enable', true)
    return (
      <ConditionalWrapper
        condition={animationsEnabled}
        wrapper={children => <Fade>{children}</Fade>}
      >
        <MessageContainer
          isfromuser={isFromUser()}
          style={{
            ...getThemeProperty('message.style'),
          }}
        >
          {isFromBot() && BotMessageImage && (
            <BotMessageImageContainer
              style={{
                ...getThemeProperty('message.bot.imageStyle'),
                ...imageStyle,
              }}
            >
              <img
                style={{ width: '100%' }}
                src={staticAsset(BotMessageImage)}
              />
            </BotMessageImageContainer>
          )}

          <Blob
            bgcolor={getBgColor()}
            color={isFromUser() ? COLORS.SOLID_WHITE : COLORS.SOLID_BLACK}
            blobWidth={getThemeProperty('message.bot.blobWidth')}
            blob={blob}
            style={{
              border: `1px solid ${getThemeProperty(
                'message.user.style.background',
                getBgColor()
              )}`,
              ...getMessageStyle(),
              ...style,
            }}
            {...otherProps}
          >
            <BlobText blob={blob}>{textChildren}</BlobText>
            {buttons}
            {isFromUser() && blob && getBlobTick() && (
              <div
                style={{
                  ...pointerStyles,
                  borderLeftColor: getThemeProperty(
                    'message.user.style.background',
                    getBgColor()
                  ),
                  right: 0,
                  borderRight: 0,
                  marginRight: -pointerSize,
                }}
              />
            )}
            {isFromBot() && blob && getBlobTick() && (
              <div
                style={{
                  ...pointerStyles,
                  borderRightColor: getThemeProperty(
                    'message.bot.style.background',
                    getBgColor()
                  ),
                  left: 0,
                  borderLeft: 0,
                  marginLeft: -pointerSize + 1,
                }}
              />
            )}
          </Blob>
        </MessageContainer>
        <TimestampContainer>
          {getTimestampFormat && timestamps && (
            <TimestampText
              isfromuser={isFromUser()}
              style={{
                ...getThemeProperty('message.timestamps.style'),
              }}
            >
              {m.timestamp}
            </TimestampText>
          )}
        </TimestampContainer>
      </ConditionalWrapper>
    )
  }

  const { blob: _blob, json: _json, ...nodeProps } = props
  const renderNode = () =>
    type === 'custom' ? (
      <message
        json={JSON.stringify(_json)}
        typing={typing}
        delay={delay}
        {...nodeProps}
      />
    ) : (
      <message typing={typing} delay={delay} {...nodeProps}>
        {children}
      </message>
    )

  return renderComponent({ renderBrowser, renderNode })
}
