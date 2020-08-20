import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { isBrowser, INPUT } from '@botonic/core'
import {
  resolveImage,
  ConditionalWrapper,
  renderComponent,
  isDev,
  isWebchatOrDev,
} from '../utils'

import { WebchatContext, RequestContext } from '../contexts'
import { Button } from './button'
import { Reply } from './reply'
import { WEBCHAT, COLORS } from '../constants'
import Fade from 'react-reveal/Fade'
import { renderMarkdown, getMarkdownStyle, renderLinks } from './markdown'
import { resolveMessageTimestamps, MessageTimestamp } from './timestamps'

const MessageContainer = styled.div`
  display: flex;
  justify-content: ${props => (props.isfromuser ? 'flex-end' : 'flex-start')};
  position: relative;
  padding: 0px 6px;
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
  ${props => props.markdownstyle}
`

const BlobTickContainer = styled.div`
  position: absolute;
  box-sizing: border-box;
  height: 100%;
  padding: 18px 0px 18px 0px;
  display: flex;
  top: 0;
  align-items: center;
`
const BlobTick = styled.div`
  position: relative;
  margin: -${props => props.pointerSize}px 0px;
  border: ${props => props.pointerSize}px solid ${COLORS.TRANSPARENT};
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
    ...otherProps
  } = props
  const isFromUser = from === 'user'
  const isFromBot = from === 'bot'
  const markdown = props.markdown
  const {
    webchatState,
    addMessage,
    updateReplies,
    getThemeProperty,
  } = useContext(WebchatContext)
  const [state, setState] = useState({
    id: props.id || uuidv4(),
  })
  const requestContext = useContext(RequestContext)

  const replies = React.Children.toArray(children).filter(e => e.type === Reply)
  const buttons = React.Children.toArray(children).filter(
    e => e.type === Button
  )
  let textChildren = React.Children.toArray(children).filter(
    e => ![Button, Reply].includes(e.type)
  )
  if (isFromUser)
    textChildren = textChildren.map(e =>
      typeof e === 'string' ? renderLinks(e) : e
    )

  const {
    timestampsEnabled,
    getFormattedTimestamp,
    timestampStyle,
  } = resolveMessageTimestamps(getThemeProperty)

  const getEnvAck = () => {
    let ack = 0
    if (isDev()) ack = 1
    else {
      if (props.ack !== undefined) ack = props.ack
      else ack = isFromUser ? 0 : 1
    }
    return ack
  }

  const ack = getEnvAck()

  if (isBrowser()) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const decomposedChildren = json
      const message = {
        id: state.id,
        type,
        data: decomposedChildren ? decomposedChildren : textChildren,
        timestamp: props.timestamp || getFormattedTimestamp,
        markdown,
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
        customTypeName: decomposedChildren.customTypeName,
        ack: ack,
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

  const brandColor = getThemeProperty('brand.color', COLORS.BOTONIC_BLUE)

  const getBgColor = () => {
    if (!blob) return COLORS.TRANSPARENT
    if (isFromUser) {
      return getThemeProperty('message.user.style.background', brandColor)
    }
    return getThemeProperty(
      'message.bot.style.background',
      COLORS.SEASHELL_WHITE
    )
  }

  const getMessageStyle = () =>
    isFromBot
      ? getThemeProperty('message.bot.style')
      : getThemeProperty('message.user.style')

  const hasBlobTick = () => getThemeProperty(`message.${from}.blobTick`, true)

  const renderBrowser = () => {
    const m = webchatState.messagesJSON.find(m => m.id === state.id)
    if (!m || !m.display) return <></>

    const getBlobTick = pointerSize => {
      // to add a border to the blobTick we need to create two triangles and overlap them
      // that is why the color depends on the pointerSize
      // https://developpaper.com/realization-code-of-css-drawing-triangle-border-method/
      const color =
        pointerSize == 5
          ? getBgColor()
          : getThemeProperty(
              `message.${from}.style.borderColor`,
              COLORS.TRANSPARENT
            )
      const containerStyle = {
        ...getThemeProperty(`message.${from}.blobTickStyle`),
      }
      const blobTickStyle = {}
      if (isFromUser) {
        containerStyle.right = 0
        containerStyle.marginRight = -pointerSize
        blobTickStyle.borderRight = 0
        blobTickStyle.borderLeftColor = color
      } else {
        containerStyle.left = 0
        containerStyle.marginLeft = -pointerSize
        blobTickStyle.borderLeft = 0
        blobTickStyle.borderRightColor = color
      }
      return (
        <BlobTickContainer style={containerStyle}>
          <BlobTick pointerSize={pointerSize} style={blobTickStyle} />
        </BlobTickContainer>
      )
    }

    const BotMessageImage = getThemeProperty(
      'message.bot.image',
      getThemeProperty('brand.image', WEBCHAT.DEFAULTS.LOGO)
    )
    const animationsEnabled = getThemeProperty('animations.enable', true)

    const resolveCustomTypeName = () =>
      isFromBot && type === INPUT.CUSTOM ? ` ${m.customTypeName}` : ''

    const className = `${type}-${from}${resolveCustomTypeName()}`
    return (
      <ConditionalWrapper
        condition={animationsEnabled}
        wrapper={children => <Fade>{children}</Fade>}
      >
        <>
          <MessageContainer
            isfromuser={isFromUser}
            style={{
              ...getThemeProperty('message.style'),
            }}
          >
            {isFromBot && BotMessageImage && (
              <BotMessageImageContainer
                style={{
                  ...getThemeProperty('message.bot.imageStyle'),
                  ...imageStyle,
                }}
              >
                <img
                  style={{ width: '100%' }}
                  src={resolveImage(BotMessageImage)}
                />
              </BotMessageImageContainer>
            )}
            <Blob
              className={className}
              bgcolor={getBgColor()}
              color={isFromUser ? COLORS.SOLID_WHITE : COLORS.SOLID_BLACK}
              blobWidth={getThemeProperty('message.bot.blobWidth')}
              blob={blob}
              style={{
                ...getMessageStyle(),
                ...style,
                ...{ opacity: ack === 0 ? 0.6 : 1 },
              }}
              {...otherProps}
            >
              {markdown && (isWebchatOrDev(requestContext) || isFromUser) ? (
                <BlobText
                  blob={blob}
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(textChildren),
                  }}
                  markdownstyle={getMarkdownStyle(
                    getThemeProperty,
                    isFromUser ? COLORS.SEASHELL_WHITE : brandColor
                  )}
                />
              ) : (
                <BlobText blob={blob}>{textChildren}</BlobText>
              )}
              {buttons}
              {blob && hasBlobTick() && getBlobTick(6)}
              {blob && hasBlobTick() && getBlobTick(5)}
            </Blob>
          </MessageContainer>
          {timestampsEnabled && (
            <MessageTimestamp
              timestamp={m.timestamp}
              style={timestampStyle}
              isfromuser={isFromUser}
            />
          )}
        </>
      </ConditionalWrapper>
    )
  }

  const { blob: _blob, json: _json, ...nodeProps } = props
  const renderNode = () =>
    type === INPUT.CUSTOM ? (
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
