import React from 'react'
import { RequestContext } from '../../contexts'
import { isWhatsapp } from './multichannel-utils'
import { deepMap } from 'react-children-utilities'
import {
  MultichannelText,
  MultichannelButton,
  MultichannelCarousel,
} from './multichannel-text'
export class Multichannel extends React.Component {
  static contextType = RequestContext
  constructor(props) {
    super(props)
  }
  render() {
    if (isWhatsapp(this.context)) {
      let newChildren = deepMap(this.props.children, child => {
        if (child && child.type && child.type.name === 'Button') {
          return (
            <MultichannelButton {...child.props}>
              {child.props.children}
            </MultichannelButton>
          )
        }
        return child
      })
      newChildren = deepMap(newChildren, child => {
        if (child && child.type && child.type.name === 'Text') {
          return (
            <MultichannelText {...child.props}>
              {child.props.children}
            </MultichannelText>
          )
        }
        return child
      })
      newChildren = deepMap(newChildren, child => {
        if (child && child.type && child.type.name === 'Carousel') {
          return (
            <MultichannelCarousel {...child.props}>
              {child.props.children}
            </MultichannelCarousel>
          )
        }
        return child
      })

      return <Multichannel {...props}>{newChildren}</Multichannel>
    }
    return this.props.children
  }
}
