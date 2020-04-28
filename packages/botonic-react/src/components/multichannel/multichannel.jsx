import React, { useContext } from 'react'
import { RequestContext } from '../../contexts'
import { Text } from '../text'
import { isWhatsapp } from './multichannel-utils'
import { MultichannelContext } from './multichannel-context'
import { MultichannelButton } from './multichannel-button'
import { MultichannelText } from './multichannel-text'
import { MultichannelCarousel } from './multichannel-carousel'
import { MultichannelReply } from './multichannel-reply'
import { deepMapWithIndex } from './deepmap-with-index'

export const Multichannel = props => {
  const requestContext = useContext(RequestContext)

  if (!isWhatsapp(requestContext)) {
    return props.children
  }

  let newChildren = deepMapWithIndex(props.children, (child, index) => {
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
        <MultichannelText
          {...child.props}
          {...props.text}
          key={props.key}
          {...(props.messageSeparator &&
            index > 0 && { newline: props.messageSeparator })}
        >
          {child.props.children}
        </MultichannelText>
      )
    }
    if (child && child.type && child.type.name === 'Carousel') {
      return (
        <MultichannelCarousel
          {...child.props}
          {...props.carousel}
          key={props.key}
        >
          {child.props.children}
        </MultichannelCarousel>
      )
    }
    return child
  })
  if (props.messageSeparator != null) {
    newChildren = newChildren.map((c, index) =>
      index > 0 && typeof c === 'string' ? props.messageSeparator + c : c
    )
    newChildren = (
      <Text {...props} key={props.key}>
        {newChildren}
      </Text>
    )
  }
  return (
    <MultichannelContext.Provider
      value={{
        currentIndex: props.firstIndex,
        boldIndex: props.boldIndex,
        indexSeparator: props.indexSeparator,
        messageSeparator: props.messageSeparator,
      }}
    >
      {newChildren}
    </MultichannelContext.Provider>
  )
}
