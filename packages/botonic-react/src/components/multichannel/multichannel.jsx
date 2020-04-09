import React, { useContext } from 'react'
import { RequestContext } from '../../contexts'
import { Text } from '../text'
import { isWhatsapp } from './multichannel-utils'
import { deepMap } from 'react-children-utilities'
import { MultichannelContext } from './multichannel-context'
import { MultichannelButton } from './multichannel-button'
import { MultichannelText } from './multichannel-text'
import { MultichannelCarousel } from './multichannel-carousel'
import { MultichannelReply } from './multichannel-reply'

export const Multichannel = props => {
  const requestContext = useContext(RequestContext)

  // const compactElements = elementsAsTexts => {
  //   // if (elementsAsTexts.length == 0) {
  //   //   return elementsAsTexts
  //   // }
  //   // const first = elementsAsTexts[0]
  //   // const children = [].concat(...elementsAsTexts.map(e => e.props.children))
  //   return <Text {...props}>{elementsAsTexts}</Text>
  // }

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
        console.log('wrapper indexMode', props.carousel)
        return (
          <MultichannelCarousel {...child.props} {...props.carousel}>
            {child.props.children}
          </MultichannelCarousel>
        )
      }
      return child
    })
    if (!props.oneMessagePerElement) {
      newChildren = <Text {...props}>{newChildren}</Text>
    }
    return (
      <MultichannelContext.Provider
        value={{
          currentIndex: props.firstIndex,
          boldIndex: props.boldIndex,
          indexSeparator: props.indexSeparator,
          oneMessagePerElement: props.oneMessagePerElement,
        }}
      >
        {newChildren}
      </MultichannelContext.Provider>
    )
  }
  return props.children
}
