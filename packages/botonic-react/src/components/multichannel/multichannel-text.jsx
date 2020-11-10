import React, { useContext } from 'react'

import { RequestContext } from '../../contexts'
import { Text } from '../text'
import { MultichannelButton } from './multichannel-button'
import { MultichannelContext } from './multichannel-context'
import {
  elementHasPostback,
  elementHasUrl,
  getMultichannelButtons,
  getMultichannelReplies,
  isMultichannelButton,
  isMultichannelReply,
  isWhatsapp,
  MULTICHANNEL_WHATSAPP_PROPS,
} from './multichannel-utils'

export const MultichannelText = props => {
  const requestContext = useContext(RequestContext)
  const multichannelContext = useContext(MultichannelContext)

  let elements = []

  const getText = () => {
    let text = undefined
    if (typeof props.children == 'string') {
      text = props.children
    } else if (Array.isArray(props.children)) {
      text = props.children[0]
    }
    if (text == undefined) {
      return []
    }
    return [text]
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
  } else {
    return <Text {...props}>{props.children}</Text>
  }
}
