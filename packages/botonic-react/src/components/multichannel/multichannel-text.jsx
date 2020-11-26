import React, { useContext } from 'react'

import { RequestContext } from '../../contexts'
import { Text } from '../text'
import { MultichannelFacebook } from './facebook/facebook'
import { MultichannelButton } from './multichannel-button'
import { MultichannelContext } from './multichannel-context'
import {
  elementHasPostback,
  elementHasUrl,
  getMultichannelButtons,
  getMultichannelReplies,
  isFacebook,
  isMultichannelButton,
  isMultichannelReply,
  isWhatsapp,
  MULTICHANNEL_WHATSAPP_PROPS,
} from './multichannel-utils'

export const MultichannelText = props => {
  const requestContext = useContext(RequestContext)
  const multichannelContext = useContext(MultichannelContext)

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
    for (const button of getButtonsAndReplies()) {
      if (elementHasUrl(button)) urlButtons.push(button)
      if (elementHasPostback(button)) postbackButtons.push(button)
    }
    return { postbackButtons, urlButtons }
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

  if (isWhatsapp(requestContext)) {
    const text = getText(props.children)
    const { postbackButtons, urlButtons } = getWhatsappButtons()

    elements = [].concat([...text], [...postbackButtons], [...urlButtons])
    multichannelContext.currentIndex = getDefaultIndex()
    elements = elements.map((element, i) => {
      const newline =
        multichannelContext.messageSeparator == null && i === 0 ? '' : '\n'
      if (isMultichannelButton(element) || isMultichannelReply(element)) {
        return (
          <MultichannelButton key={i} newline={newline} {...element.props}>
            {element.props.children}
          </MultichannelButton>
        )
      } else if (typeof element === 'string') {
        return (props.newline || '') + element
      } else {
        return element
      }
    })
    if (multichannelContext.messageSeparator != null) {
      return elements
    }
    return (
      <Text {...MULTICHANNEL_WHATSAPP_PROPS} {...props}>
        {elements}
      </Text>
    )
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
