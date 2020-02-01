import React from 'react'
import { RequestContext } from '../../contexts'
import { Text } from '../text'
import { Providers } from '@botonic/core'

export class MultichannelText extends React.Component {
  static contextType = RequestContext
  constructor(props) {
    super(props)
    this.elements = []
  }
  render() {
    if (this.context.session.user.provider == Providers.Messaging.WHATSAPPNEW) {
      let text = !Array.isArray(this.props.children)
        ? [this.props.children]
        : this.props.children.filter(e => !e.props)

      let payloadButtons = !Array.isArray(this.props.children)
        ? []
        : this.props.children.filter(
            e => e.props && (e.props.payload || e.props.path)
          )

      let otherButtons = !Array.isArray(this.props.children)
        ? []
        : this.props.children.filter(
            e => e.props && !(e.props.payload || e.props.path)
          )

      this.elements = [].concat(
        [...text],
        [...payloadButtons],
        [...otherButtons]
      )
      let index = 0
      return (
        <Text>
          {this.elements.map((element, i) => {
            if (
              (element.props && element.props.payload != undefined) ||
              (element.props && element.props.path != undefined)
            ) {
              index += 1
            }
            let option = ' - '
            if (element.type && element.type.name == 'MultichannelButton') {
              if (element.props.payload || element.props.path) {
                option = ` ${index}. `
              }
              let props = {}
              props.url = element.props.url
              props.children = `\n${option}${element.props.children}`
              props.key = i
              let newElement = React.cloneElement(element, { ...props })
              return newElement
            } else if (
              element.type &&
              element.type.name == 'MultichannelReply'
            ) {
              if (element.props.payload || element.props.path) {
                option = ` ${index}. `
              }
              let props = {}
              props.children = `\n${option}${element.props.children}`
              props.key = i
              let newElement = React.cloneElement(element, { ...props })
              return newElement
            } else {
              return `${element}`
            }
          })}
        </Text>
      )
    } else {
      return <Text>{this.props.children}</Text>
    }
  }
}
