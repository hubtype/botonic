import React from 'react'
import { RequestContext } from '../../contexts'
import { Text } from '../text'
import { Providers } from '@botonic/core'
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

export class MultichannelText extends React.Component {
  static contextType = RequestContext
  constructor(props) {
    super(props)
    this.elements = []
    this.newIndex = props.newkey !== undefined ? props.newkey + 1 : undefined
  }

  getText() {
    if (typeof this.props.children == 'string') {
      return [this.props.children]
    } else if (Array.isArray(this.props.children)) {
      return [this.props.children[0]]
    }
  }

  getButtonsAndReplies() {
    return [].concat(
      getMultichannelButtons(React.Children.toArray(this.props.children)),
      getMultichannelReplies(React.Children.toArray(this.props.children))
    )
  }

  getWhatsappButtons() {
    let postbackButtons = []
    let urlButtons = []
    for (let button of this.getButtonsAndReplies()) {
      if (elementHasUrl(button)) urlButtons.push(button)
      if (elementHasPostback(button)) postbackButtons.push(button)
    }
    return { postbackButtons, urlButtons }
  }

  render() {
    if (isWhatsapp(this.context)) {
      const text = this.getText(this.props.children)
      const { postbackButtons, urlButtons } = this.getWhatsappButtons()

      this.elements = [].concat(
        [...text],
        [...postbackButtons],
        [...urlButtons]
      )
      this.context.currentIndex =
        this.context.currentIndex != null ? this.context.currentIndex : 1
      return (
        <Text {...this.props}>
          {this.elements.map((element, i) => {
            if (isMultichannelButton(element) || isMultichannelReply(element)) {
              return (
                <MultichannelButton key={i} {...element.props}>
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
      return <Text {...this.props}>{this.props.children}</Text>
    }
  }
}
