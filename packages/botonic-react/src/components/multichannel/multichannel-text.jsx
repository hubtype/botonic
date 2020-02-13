import React, { useContext } from 'react'
import { RequestContext } from '../../contexts'
import { Text } from '../text'
import {
  elementHasUrl,
  getMultichannelButtons,
  isWhatsapp,
  elementHasPostback,
  isMultichannelButton,
  isMultichannelReply,
  getMultichannelReplies,
} from './multichannel-utils'
import { MultichannelButton } from './multichannel-button'
import { MultichannelContext } from './multichannel-context'

export const MultichannelText = props => {
  const requestContext = useContext(RequestContext)
  const multichannelContext = useContext(MultichannelContext)

  let elements = []

  const getText = () => {
    if (typeof props.children == 'string') {
      return [props.children]
    } else if (Array.isArray(props.children)) {
      return [props.children[0]]
    }
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

  if (isWhatsapp(requestContext)) {
    const text = getText(props.children)
    const { postbackButtons, urlButtons } = getWhatsappButtons()

    elements = [].concat([...text], [...postbackButtons], [...urlButtons])

    multichannelContext.currentIndex =
      multichannelContext.currentIndex != null
        ? multichannelContext.currentIndex
        : 1
    return (
      <Text {...props}>
        {elements.map((element, i) => {
          if (isMultichannelButton(element) || isMultichannelReply(element)) {
            return (
              <MultichannelButton key={i} newline={i > 0} {...element.props}>
                {element.props.children}
              </MultichannelButton>
            )
          } else {
            return element
          }
        })}
      </Text>
    )
  } else {
    return <Text {...props}>{props.children}</Text>
  }
}
