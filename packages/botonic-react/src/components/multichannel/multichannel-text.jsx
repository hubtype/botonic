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

export class MultichannelText extends React.Component {
  static contextType = RequestContext
  constructor(props) {
    super(props)
    this.elements = []
    // this.index = props.index !== undefined ? props.index + 1 : undefined
  }

  getText() {
    if (typeof this.props.children == 'string') {
      return [this.props.children]
    } else if (Array.isArray(this.props.children)) {
      return [this.props.children[0]]
    }
  }

  getButtons() {
    return [].concat(
      getMultichannelButtons(React.Children.toArray(this.props.children)),
      getMultichannelReplies(React.Children.toArray(this.props.children))
    )
  }

  getWhatsappButtons() {
    let postbackButtons = []
    let urlButtons = []
    for (let button of this.getButtons()) {
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

      let index = 0
      return (
        <Text {...this.props}>
          {this.elements.map((element, i) => {
            if (elementHasPostback(element)) {
              index += 1
            }
            let option = ' - '
            if (isMultichannelButton(element) || isMultichannelReply(element)) {
              if (elementHasPostback(element)) {
                // option = this.index ? ` ${this.index}. ` : ` ${index}. `
                option = ` ${index}. `
              }
              let props = {
                url: element.props.url,
                children: `\n${option}${element.props.children}`,
                key: i,
              }

              let newElement = React.cloneElement(element, { ...props })
              return newElement
            } else {
              return `${element}`
            }
          })}
        </Text>
      )
    } else {
      return <Text {...this.props}>{this.props.children}</Text>
    }
  }
}
