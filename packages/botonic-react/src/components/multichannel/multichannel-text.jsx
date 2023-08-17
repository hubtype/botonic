import { INPUT } from '@botonic/core/lib/esm/models/legacy-types'
import React, { useContext } from 'react'

import { RequestContext } from '../../contexts'
import { WhatsappButtonList } from '..'
import { Text } from '../text'
import { MultichannelFacebook } from './facebook/facebook'
import { MultichannelButton } from './multichannel-button'
import { MultichannelContext } from './multichannel-context'
import {
  buttonTypes,
  DEFAULT_WHATSAPP_MAX_BUTTON_SEPARATOR,
  elementHasPostback,
  elementHasUrl,
  elementHasWebview,
  getButtonType,
  getMultichannelButtons,
  getMultichannelReplies,
  isFacebook,
  isWhatsapp,
  MENU_BUTOON_WHATSAPP_BUTTON_LIST,
  MULTICHANNEL_WHATSAPP_PROPS,
  WHATSAPP_LIST_MAX_BUTTONS,
  WHATSAPP_MAX_BUTTONS,
} from './multichannel-utils'
import { whatsappMarkdown } from './whatsapp/markdown'

export const MultichannelText = props => {
  const requestContext = useContext(RequestContext)
  const multichannelContext = useContext(MultichannelContext)
  const postbackButtonsAsText = props.buttonsAsText ?? true

  let elements = []

  const getText = children => {
    children = Array.isArray(children) ? children : [children]
    const text = children
      .filter(e => e && !e.type)
      .map(e => {
        if (Array.isArray(e)) return getText(e)
        else return String(e)
      })
      .join('')
    if (text == undefined) {
      return []
    }
    return [text].filter(t => t !== '') // to avoid line breaks when the carousel doesn't have title or subtitle
  }

  const getButtonsAndReplies = () =>
    [].concat(
      getMultichannelButtons(React.Children.toArray(props.children)),
      getMultichannelReplies(React.Children.toArray(props.children))
    )

  const getWhatsappButtons = () => {
    const postbackButtons = []
    const urlButtons = []
    const webviewButtons = []
    for (const button of getButtonsAndReplies()) {
      if (elementHasUrl(button)) urlButtons.push(button)
      else if (elementHasWebview(button)) webviewButtons.push(button)
      else if (elementHasPostback(button)) postbackButtons.push(button)
    }
    return { postbackButtons, urlButtons, webviewButtons }
  }

  const getDefaultIndex = () => {
    if (props.indexMode == undefined) {
      return undefined
    }
    if (multichannelContext.currentIndex != null) {
      return multichannelContext.currentIndex
    }
    return props.indexMode === 'letter' ? 'a' : 1
  }

  const regenerateMultichannelButtons = (newLineFirstButton = true) => {
    const generator = (multichannelButton, i) => {
      const type = getButtonType(multichannelButton)
      const asText =
        type === buttonTypes.POSTBACK ? postbackButtonsAsText : true
      const newline =
        multichannelContext.messageSeparator == null &&
        !newLineFirstButton &&
        i === 0
          ? ''
          : '\n'
      if (type !== buttonTypes.POSTBACK && multichannelButton.props.payload) {
        delete multichannelButton.props.payload
      }
      return (
        <MultichannelButton
          key={`${type}${i}`}
          newline={newline}
          asText={asText}
          {...multichannelButton.props}
        >
          {multichannelButton.props.children}
        </MultichannelButton>
      )
    }
    return generator
  }

  const splitInWhatsappListButtons = postbackButtons => {
    const messages = []
    for (
      let i = 0;
      i < postbackButtons.length;
      i += WHATSAPP_LIST_MAX_BUTTONS
    ) {
      messages.push(postbackButtons.slice(i, i + WHATSAPP_LIST_MAX_BUTTONS))
    }
    return messages
  }

  // START WHATSAPP LOGIC
  if (isWhatsapp(requestContext)) {
    const texts = getText(props.children)
    const { postbackButtons, urlButtons, webviewButtons } = getWhatsappButtons()

    const textElements = texts.map(text => {
      const textWithMarkdown = whatsappMarkdown(text)
      return (props.newline || '') + textWithMarkdown
    })

    const webviewButtonElements = webviewButtons.map(
      regenerateMultichannelButtons(false)
    )

    const buttonsTextSeparator =
      props.buttonsTextSeparator || DEFAULT_WHATSAPP_MAX_BUTTON_SEPARATOR

    //MORE THAN 3 BUTTONS
    if (
      !postbackButtonsAsText &&
      postbackButtons.length > WHATSAPP_MAX_BUTTONS
    ) {
      const menuButtonTextWhatsappList =
        props.menuButtonTextWhatsappList || MENU_BUTOON_WHATSAPP_BUTTON_LIST

      const urlButtonElements = urlButtons.map(
        regenerateMultichannelButtons(!!texts.length)
      )
      const postbackButtonElements = postbackButtons.map(
        regenerateMultichannelButtons(!!texts.length || !!urlButtons.length)
      )

      const messagesPostbackButtonList = splitInWhatsappListButtons(
        postbackButtonElements
      )

      const messages = messagesPostbackButtonList.map(
        (postbackButtons, index) => {
          if (postbackButtons.length < 4) {
            return {
              type: INPUT.TEXT,
              children: [...buttonsTextSeparator, ...postbackButtons],
            }
          }
          const rows = postbackButtons.map(postbackButton => {
            const row = {
              id: postbackButton.props.payload,
              title: postbackButton.props.children,
            }
            return row
          })
          const whatsbuttonlistProps = {
            body: index === 0 ? textElements : buttonsTextSeparator,
            button: menuButtonTextWhatsappList,
            sections: [{ rows }],
          }

          return {
            type: INPUT.WHATSAPP_BUTTON_LIST,
            props: whatsbuttonlistProps,
          }
        }
      )

      const messageWithUrlButtonElements = (
        <Text
          key={`msg-with-url-button`}
          {...MULTICHANNEL_WHATSAPP_PROPS}
          {...props}
        >
          {urlButtonElements}
        </Text>
      )

      const messageWithWebviewButtonElements = (
        <Text
          key={`msg-with-webview-button`}
          {...MULTICHANNEL_WHATSAPP_PROPS}
          {...props}
        >
          {buttonsTextSeparator}
          {webviewButtonElements}
        </Text>
      )

      return (
        <>
          {messages.map((message, i) => {
            if (message.type === INPUT.WHATSAPP_BUTTON_LIST)
              return (
                <WhatsappButtonList
                  key={`msg-${i}-whatsapp-list`}
                  {...message.props}
                />
              )
            return (
              <Text
                key={`msg-${i}-with-postback-buttons`}
                {...MULTICHANNEL_WHATSAPP_PROPS}
                {...props}
              >
                {message.children}
              </Text>
            )
          })}
          {urlButtonElements.length ? messageWithUrlButtonElements : null}
          {webviewButtonElements.length
            ? messageWithWebviewButtonElements
            : null}
        </>
      )
    }
    // END LOGIC WHATSAPP WITH MORE THAN 3 BUTTONS

    multichannelContext.currentIndex = getDefaultIndex()
    const postbackButtonElements = postbackButtons.map(
      regenerateMultichannelButtons(!!texts.length)
    )
    const urlButtonElements = urlButtons.map(
      regenerateMultichannelButtons(!!texts.length || !!postbackButtons.length)
    )

    elements = [].concat(
      [...textElements],
      [...postbackButtonElements],
      [...urlButtonElements]
    )
    if (multichannelContext.messageSeparator != null) {
      return elements
    }
    const messages = [
      <Text key={0} {...MULTICHANNEL_WHATSAPP_PROPS} {...props}>
        {elements}
      </Text>,
    ]
    if (webviewButtonElements.length) {
      messages.push(
        <Text key={1} {...MULTICHANNEL_WHATSAPP_PROPS} {...props}>
          {buttonsTextSeparator}
          {webviewButtonElements}
        </Text>
      )
    }

    return <>{messages}</>
  }
  // END WHATSAPP LOGIC

  // START FACEBOOK LOGIC
  if (isFacebook(requestContext)) {
    const text = getText(props.children)
    const multichannelFacebook = new MultichannelFacebook()
    const { texts, propsLastText, propsWithoutChildren } =
      multichannelFacebook.convertText(props, text[0])
    return (
      <>
        {texts &&
          texts.map((e, i) => (
            <Text key={i} {...propsWithoutChildren}>
              {e}
            </Text>
          ))}
        <Text {...propsLastText}>{propsLastText.children}</Text>
      </>
    )
  } else {
    return <Text {...props}>{props.children}</Text>
  }
}
