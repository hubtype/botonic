import { INPUT, isBrowser } from '@botonic/core'
import React, { useContext, useEffect, useState } from 'react'
import { v7 as uuidv7 } from 'uuid'

import { COLORS, WEBCHAT } from '../../constants'
import { RequestContext } from '../../contexts'
import { SENDERS } from '../../index-types'
import { Fade } from '../../shared/styles'
import { isDev } from '../../util/environment'
import { ConditionalWrapper, renderComponent } from '../../util/react'
import { WebchatContext } from '../../webchat/context'
import { Button } from '../button'
import { ButtonsDisabler } from '../buttons-disabler'
import { getMarkdownStyle, renderLinks, renderMarkdown } from '../markdown'
import { Reply } from '../reply'
import { MessageFooter } from './message-footer'
import { MessageImage } from './message-image'
import {
  BlobContainer,
  BlobText,
  BlobTick,
  BlobTickContainer,
  MessageContainer,
} from './styles'
import { resolveMessageTimestamps } from './timestamps'

export const Message = props => {
  const { defaultTyping, defaultDelay } = useContext(RequestContext)
  let {
    type = '',
    blob = true,
    sentBy,
    delay = defaultDelay,
    typing = defaultTyping,
    children,
    enabletimestamps = props.enabletimestamps || props.enableTimestamps,
    json,
    style,
    imagestyle = props.imagestyle || props.imageStyle,
    isUnread = true,
    feedbackEnabled,
    inferenceId,
    botInteractionId,
    ...otherProps
  } = props

  const isSentByUser = sentBy === SENDERS.user
  const isSentByBot = sentBy === SENDERS.bot
  const markdown = props.markdown
  const { webchatState, addMessage, updateReplies, getThemeProperty } =
    useContext(WebchatContext)
  const [state, setState] = useState({
    id: props.id || uuidv7(),
  })

  const [disabled, setDisabled] = useState(false)
  children = ButtonsDisabler.updateChildrenButtons(children, {
    parentId: state.id,
    disabled,
    setDisabled,
  })
  const replies = React.Children.toArray(children).filter(e => e.type === Reply)
  const buttons = React.Children.toArray(children).filter(
    e => e.type === Button
  )

  let textChildren = React.Children.toArray(children).filter(
    e => ![Button, Reply].includes(e.type)
  )
  if (isSentByUser)
    textChildren = textChildren.map(e =>
      typeof e === 'string' ? renderLinks(e) : e
    )

  const { timestampsEnabled, getFormattedTimestamp } = resolveMessageTimestamps(
    getThemeProperty,
    enabletimestamps
  )

  const getEnvAck = () => {
    if (isDev) return 1
    if (!isSentByUser) return 1
    if (props.ack !== undefined) return props.ack
    return 0
  }

  const ack = getEnvAck()

  useEffect(() => {
    if (isBrowser()) {
      const decomposedChildren = json
      const message = {
        id: state.id,
        type,
        data: decomposedChildren ? decomposedChildren : textChildren,
        timestamp: props.timestamp || getFormattedTimestamp,
        markdown,
        sentBy,
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
          url: r.props.url,
          text: r.props.children,
        })),
        display: delay + typing == 0,
        customTypeName: decomposedChildren.customTypeName,
        ack: ack,
        isUnread: isUnread === 1 || isUnread === true,
        feedbackEnabled,
        inferenceId,
        botInteractionId,
      }
      addMessage(message)
    }
  }, [])

  useEffect(() => {
    if (isBrowser()) {
      const msg = webchatState.messagesJSON.find(m => m.id === state.id)
      if (
        msg &&
        msg.display &&
        webchatState.messagesJSON.filter(m => !m.display).length == 0
      ) {
        updateReplies(replies)
      }
    }
  }, [webchatState.messagesJSON])

  const brandColor = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.brandColor,
    COLORS.BOTONIC_BLUE
  )

  const getBgColor = () => {
    if (!blob) return COLORS.TRANSPARENT
    if (isSentByUser) {
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
    isSentByUser
      ? getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.userMessageStyle)
      : getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.botMessageStyle)

  const userOrBotMessage = isSentByUser ? SENDERS.user : SENDERS.bot
  const hasBlobTick = () =>
    getThemeProperty(`message.${userOrBotMessage}.blobTick`, true)

  const renderBrowser = () => {
    const messageJSON = webchatState.messagesJSON.find(m => m.id === state.id)
    if (!messageJSON || !messageJSON.display) return <></>

    const getBlobTick = pointerSize => {
      // to add a border to the blobTick we need to create two triangles and overlap them
      // that is why the color depends on the pointerSize
      // https://developpaper.com/realization-code-of-css-drawing-triangle-border-method/
      const color =
        pointerSize == 5
          ? getBgColor()
          : getThemeProperty(
              `message.${userOrBotMessage}.style.borderColor`,
              COLORS.TRANSPARENT
            )
      const containerStyle = {
        ...getThemeProperty(`message.${userOrBotMessage}.blobTickStyle`),
      }
      const blobTickStyle = {}
      if (isSentByUser) {
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

    const animationsEnabled = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.enableAnimations,
      true
    )

    const resolveCustomTypeName = () =>
      isSentByBot && type === INPUT.CUSTOM
        ? ` ${messageJSON.customTypeName}`
        : ''

    const className = `${type}-${userOrBotMessage}${resolveCustomTypeName()}`

    return (
      <ConditionalWrapper
        condition={animationsEnabled}
        wrapper={children => <Fade>{children}</Fade>}
      >
        <>
          <MessageContainer
            isSentByUser={isSentByUser}
            style={{
              ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.messageStyle),
            }}
          >
            <MessageImage imagestyle={imagestyle} sentBy={sentBy} />
            <BlobContainer
              className={className}
              bgcolor={getBgColor()}
              color={isSentByUser ? COLORS.SOLID_WHITE : COLORS.SOLID_BLACK}
              blobwidth={getThemeProperty(
                WEBCHAT.CUSTOM_PROPERTIES.botMessageBlobWidth
              )}
              blob={blob}
              style={{
                ...getMessageStyle(),
                ...style,
                ...{ opacity: ack === 0 ? 0.6 : 1 },
              }}
              {...otherProps}
            >
              {markdown ? (
                <BlobText
                  blob={blob}
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(textChildren),
                  }}
                  markdownstyle={getMarkdownStyle(
                    getThemeProperty,
                    isSentByUser ? COLORS.SEASHELL_WHITE : brandColor
                  )}
                />
              ) : (
                <BlobText blob={blob}>{textChildren}</BlobText>
              )}
              {!!buttons.length && (
                <div className='message-buttons-container'>{buttons}</div>
              )}
              {Boolean(blob) && hasBlobTick() && getBlobTick(6)}
              {Boolean(blob) && hasBlobTick() && getBlobTick(5)}
            </BlobContainer>
          </MessageContainer>
          {timestampsEnabled || feedbackEnabled ? (
            <MessageFooter
              enabletimestamps={timestampsEnabled}
              messageJSON={messageJSON}
              sentBy={sentBy}
              feedbackEnabled={feedbackEnabled}
              inferenceId={inferenceId}
              botInteractionId={botInteractionId}
            />
          ) : null}
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
