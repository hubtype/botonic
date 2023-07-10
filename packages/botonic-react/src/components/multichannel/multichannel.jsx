import React, { useContext } from 'react'

import { COMPONENT_TYPE } from '../../constants'
import { RequestContext } from '../../contexts'
import { deepMapWithIndex } from '../../util/react'
import { Text } from '../text'
import { MultichannelButton } from './multichannel-button'
import { MultichannelCarousel } from './multichannel-carousel'
import { MultichannelContext } from './multichannel-context'
import { MultichannelReply } from './multichannel-reply'
import { MultichannelText } from './multichannel-text'
import {
  isFacebook,
  isWhatsapp,
  MULTICHANNEL_WHATSAPP_PROPS,
} from './multichannel-utils'

export const Multichannel = props => {
  const requestContext = useContext(RequestContext)
  if (!isWhatsapp(requestContext) && !isFacebook(requestContext)) {
    return props.children
  }
  if (isFacebook(requestContext)) {
    const newChildren = deepMapWithIndex(props.children, child => {
      if (child && child.type && child.type.name === COMPONENT_TYPE.TEXT) {
        return (
          <MultichannelText {...child.props} key={child.key}>
            {child.props.children}
          </MultichannelText>
        )
      }
      return child
    })
    return newChildren
  }

  let newChildren = deepMapWithIndex(props.children, (child, index) => {
    if (child && child.type && child.type.name === COMPONENT_TYPE.BUTTON) {
      return (
        <MultichannelButton {...child.props} key={child.key}>
          {child.props.children}
        </MultichannelButton>
      )
    }
    if (child && child.type && child.type.name === COMPONENT_TYPE.REPLY) {
      return (
        <MultichannelReply {...child.props} key={child.key}>
          {child.props.children}
        </MultichannelReply>
      )
    }
    if (child && child.type && child.type.name === COMPONENT_TYPE.TEXT) {
      return (
        <MultichannelText
          {...child.props}
          {...props.text}
          key={child.key}
          {...(props.messageSeparator &&
            index > 0 && { newline: props.messageSeparator })}
        >
          {child.props.children}
        </MultichannelText>
      )
    }
    if (child && child.type && child.type.name === COMPONENT_TYPE.CAROUSEL) {
      return (
        <MultichannelCarousel
          {...child.props}
          {...props.carousel}
          key={child.key}
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
      <Text key={props.key} {...MULTICHANNEL_WHATSAPP_PROPS}>
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
