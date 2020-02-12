import React, { useContext, useState } from 'react'
import { RequestContext } from '../../contexts'
import { isWhatsapp } from './multichannel-utils'
import { deepMap } from 'react-children-utilities'
import { MultichannelContext } from './multichannel-context'
import { MultichannelButton } from './multichannel-button'
import { MultichannelText } from './multichannel-text'
import { MultichannelCarousel } from './multichannel-carousel'
import { MultichannelReply } from './multichannel-reply'

export const Multichannel = props => {
  let requestContext = useContext(RequestContext)

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
          <MultichannelText {...child.props}>
            {child.props.children}
          </MultichannelText>
        )
      }
      if (child && child.type && child.type.name === 'Carousel') {
        return (
          <MultichannelCarousel {...child.props}>
            {child.props.children}
          </MultichannelCarousel>
        )
      }
      return child
    })

    return (
      <MultichannelContext.Provider
        value={{
          currentIndex: 1,
        }}
      >
        {newChildren}
      </MultichannelContext.Provider>
    )
  }
  return props.children
}
