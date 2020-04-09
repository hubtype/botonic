import React, { useContext } from 'react'
import { RequestContext } from '../../contexts'
import { isWhatsapp } from './multichannel-utils'
import { deepMap } from 'react-children-utilities'
import { MultichannelContext } from './multichannel-context'
import { MultichannelButton } from './multichannel-button'
import { MultichannelText } from './multichannel-text'
import { MultichannelCarousel } from './multichannel-carousel'
import { MultichannelReply } from './multichannel-reply'

export const Multichannel = props => {
  const requestContext = useContext(RequestContext)

  const compactElements = elementsAsTexts => {
    if (elementsAsTexts.length == 0) {
      return elementsAsTexts
    }
    const first = elementsAsTexts[0]
    const children = [].concat(...elementsAsTexts.map(e => e.props.children))
    return <MultichannelText {...first.props}>{children}</MultichannelText>
  }

  if (isWhatsapp(requestContext)) {
    let newChildren = deepMap(props.children, child => {
      if (child && child.type && child.type.name === 'Button') {
        return (
          <MultichannelButton {...child.props}>
            {child.props.children}
          </MultichannelButton>
        )
      }
      if (child && child.type && child.type.name === 'Reply') {
        return (
          <MultichannelReply {...child.props}>
            {child.props.children}
          </MultichannelReply>
        )
      }
      if (child && child.type && child.type.name === 'Text') {
        return (
          <MultichannelText {...child.props} {...props.text}>
            {child.props.children}
          </MultichannelText>
        )
      }
      if (child && child.type && child.type.name === 'Carousel') {
        return (
          <MultichannelCarousel {...child.props} {...props.carousel}>
            {child.props.children}
          </MultichannelCarousel>
        )
      }
      return child
    })
    if (!props.oneMessagePerElement) {
      newChildren = compactElements(newChildren)
    }
    return (
      <MultichannelContext.Provider
        value={{
          currentIndex: props.firstIndex,
          boldIndex: props.boldIndex,
          indexSeparator: props.indexSeparator,
        }}
      >
        {newChildren}
      </MultichannelContext.Provider>
    )
  }
  return props.children
}
