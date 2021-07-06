import React, { useContext } from 'react'

import { RequestContext } from '../../contexts'
import { Text } from '../text'
import { MultichannelFacebook } from './facebook/facebook'
import { MultichannelButton } from './multichannel-button'
import { MultichannelContext } from './multichannel-context'
import {
  DEFAULT_WHATSAPP_MAX_BUTTON_SEPARATOR,
  elementHasPostback,
  elementHasUrl,
  elementHasWebview,
  getMultichannelButtons,
  getMultichannelReplies,
  isFacebook,
  isWhatsapp,
  MULTICHANNEL_WHATSAPP_PROPS,
  WHATSAPP_MAX_BUTTONS,
} from './multichannel-utils'

const buttonTypes = {
  POSTBACK: 'postback',
  URL: 'url',
  WEBVIEW: 'webview',
}

export const MultichannelText = props => {
  const requestContext = useContext(RequestContext)
  const multichannelContext = useContext(MultichannelContext)
  const postbackButtonsAsText =
    props.buttonsAsText !== undefined ? props.buttonsAsText : true

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
      if (elementHasPostback(button)) postbackButtons.push(button)
      if (elementHasWebview(button)) webviewButtons.push(button)
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

  const generateMultichannelButtons = type => {
    const asText = type === buttonTypes.POSTBACK ? postbackButtonsAsText : true
    const generator = (element, i) => {
      return (
        <MultichannelButton
          key={`${type}${i}`}
          newline={'\n'}
          asText={asText}
          {...element.props}
        >
          {element.props.children}
        </MultichannelButton>
      )
    }
    return generator
  }

  const splitPostbackButtons = postbackButtons => {
    const messages = []
    for (let i = 0; i < postbackButtons.length; i += WHATSAPP_MAX_BUTTONS) {
      messages.push(postbackButtons.slice(i, i + WHATSAPP_MAX_BUTTONS))
    }
    return messages
  }

  if (isWhatsapp(requestContext)) {
    const texts = getText(props.children)
    const { postbackButtons, urlButtons, webviewButtons } = getWhatsappButtons()

    const textElements = texts.map(text => {
      return (props.newline || '') + text
    })
    const postbackButtonElements = postbackButtons.map(
      generateMultichannelButtons('postback')
    )
    const urlButtonElements = urlButtons.map(generateMultichannelButtons('url'))
    const webviewButtonElements = webviewButtons.map(
      generateMultichannelButtons('webview')
    )

    const buttonsTextSeparator =
      props.buttonsTextSeparator || DEFAULT_WHATSAPP_MAX_BUTTON_SEPARATOR

    if (
      !postbackButtonsAsText &&
      postbackButtons.length > WHATSAPP_MAX_BUTTONS
    ) {
      const messagesPostbackButtons = splitPostbackButtons(
        postbackButtonElements
      )

      const messages = messagesPostbackButtons.map((postbackButtons, i) => {
        if (i === 0) {
          return [].concat(...texts, ...urlButtonElements, ...postbackButtons)
        } else {
          return [].concat(buttonsTextSeparator, ...postbackButtons)
        }
      })
      if (webviewButtonElements) {
        messages.push([buttonsTextSeparator, ...webviewButtonElements])
      }

      return (
        <>
          {messages.map((message, i) => (
            <Text key={i} {...MULTICHANNEL_WHATSAPP_PROPS} {...props}>
              {message}
            </Text>
          ))}
        </>
      )
    } else {
      multichannelContext.currentIndex = getDefaultIndex()
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
  }

  if (isFacebook(requestContext)) {
    const text = getText(props.children)
    const multichannelFacebook = new MultichannelFacebook()
    const {
      texts,
      propsLastText,
      propsWithoutChildren,
    } = multichannelFacebook.convertText(props, text[0])
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
