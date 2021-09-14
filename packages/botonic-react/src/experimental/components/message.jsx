import { INPUT, isBrowser, MessageEventAck } from '@botonic/core'
import React, { useContext, useEffect, useState } from 'react'
import Fade from 'react-reveal/Fade'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '../../components/button'
import { ButtonsDisabler } from '../../components/buttons-disabler'
import { Reply } from '../../components/reply'
import {
  MessageTimestamp,
  resolveMessageTimestamps,
} from '../../components/timestamps'
import { COLORS, SENDERS, WEBCHAT } from '../../constants'
import { RequestContext, WebchatContext } from '../../contexts'
import { isDev, resolveImage } from '../../util/environment'
import { ConditionalWrapper, renderComponent } from '../../util/react'
// Experimental
import { getMarkdownStyle, renderLinks, renderMarkdown } from './markdown'

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
      ? props.blobwidth
        ? props.blobwidth
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
  let {
    type = '',
    blob = true,
    from = SENDERS.bot,
    delay = defaultDelay,
    typing = defaultTyping,
    children,
    enabletimestamps = props.enabletimestamps || props.enableTimestamps,
    json,
    style,
    imagestyle = props.imagestyle || props.imageStyle,
    ...otherProps
  } = props

  const isFromUser = from === SENDERS.user
  const isFromBot = from === SENDERS.bot
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

  const [disabled, setDisabled] = useState(false)
  children = ButtonsDisabler.updateChildrenButtons(children, {
    parentId: state.id,
    disabled,
    setDisabled,
  })

  const childrenWithoutButtonsNorReplies = React.Children.toArray(
    children
  ).filter(e => ![Button, Reply].includes(e.type))

  const textChildren = childrenWithoutButtonsNorReplies
    .filter(e => typeof e === 'string')
    .join('')

  const replies = React.Children.toArray(children).filter(e => e.type === Reply)
  const buttons = React.Children.toArray(children).filter(
    e => e.type === Button
  )

  const {
    timestampsEnabled,
    getFormattedTimestamp,
    timestampStyle,
  } = resolveMessageTimestamps(getThemeProperty, enabletimestamps)

  const resolveAck = ack => {
    // TODO: Resolution for browser app?
    if (ack !== undefined) return ack
    if (isFromBot) return MessageEventAck.RECEIVED
    return MessageEventAck.DRAFT
  }

  const ack = resolveAck(props.ack)

  if (isBrowser()) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const decomposedChildren = json
      const message = {
        id: state.id,
        type,
        // data: decomposedChildren ? decomposedChildren : textChildren,
        text: props.text || textChildren || undefined,
        src: props.src,
        lat: props.lat,
        long: props.long,
        timestamp: props.timestamp || getFormattedTimestamp,
        markdown,
        from,
        buttons: buttons.map(b => ({
          parentId: b.props.parentId,
          payload: b.props.payload,
          path: b.props.path,
          url: b.props.url,
          target: b.props.target,
          webview: b.props.webview && String(b.props.webview),
          title: b.props.children,
          ...ButtonsDisabler.withDisabledProps(b.props),
        })),
        delay,
        typing,
        replies: replies.map(r => ({
          payload: r.props.payload,
          path: r.props.path,
          title: r.props.children,
        })),
        elements: props.elements,
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

  const brandColor = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.brandColor,
    COLORS.BOTONIC_BLUE
  )

  const getBgColor = () => {
    if (!blob) return COLORS.TRANSPARENT
    if (isFromUser) {
      return getThemeProperty(
        WEBCHAT.CUSTOM_PROPERTIES.userMessageBackground,
        brandColor
      )
    }
    return getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.botMessageBackground,
      COLORS.SEASHELL_WHITE
    )
  }

  const getMessageStyle = () =>
    isFromBot
      ? getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.botMessageStyle)
      : getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.userMessageStyle)

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
      WEBCHAT.CUSTOM_PROPERTIES.botMessageImage,
      getThemeProperty(
        WEBCHAT.CUSTOM_PROPERTIES.brandImage,
        WEBCHAT.DEFAULTS.LOGO
      )
    )
    const animationsEnabled = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.enableAnimations,
      true
    )

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
              ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.messageStyle),
            }}
          >
            {isFromBot && BotMessageImage && (
              <BotMessageImageContainer
                style={{
                  ...getThemeProperty(
                    WEBCHAT.CUSTOM_PROPERTIES.botMessageImageStyle
                  ),
                  ...imagestyle,
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
              blobwidth={getThemeProperty(
                WEBCHAT.CUSTOM_PROPERTIES.botMessageBlobWidth
              )}
              blob={blob}
              style={{
                ...getMessageStyle(),
                ...style,
                ...{ opacity: ack === MessageEventAck.DRAFT ? 0.6 : 1 },
              }}
              {...otherProps}
            >
              {markdown ? (
                <BlobText
                  blob={blob}
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(
                      isFromUser ? renderLinks(textChildren) : textChildren
                    ),
                  }}
                  markdownstyle={getMarkdownStyle(
                    getThemeProperty,
                    isFromUser ? COLORS.SEASHELL_WHITE : brandColor
                  )}
                />
              ) : (
                <BlobText blob={blob}>
                  {childrenWithoutButtonsNorReplies}
                </BlobText>
              )}
              {buttons}
              {Boolean(blob) && hasBlobTick() && getBlobTick(6)}
              {Boolean(blob) && hasBlobTick() && getBlobTick(5)}
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
