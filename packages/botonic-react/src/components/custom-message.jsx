import React from 'react'
import { INPUT } from '@botonic/core'
import merge from 'lodash.merge'

import { Message } from './message'
import { Reply } from './reply'
import { mapObjectNonBooleanValues } from '../utils'

export const customMessage = ({
  name,
  component: CustomMessageComponent,
  defaultProps,
}) => {
  const CustomMessage = props => (
    <Message
      {...merge(mapObjectNonBooleanValues(defaultProps), props)}
      type={INPUT.CUSTOM}
    />
  )

  const SplitChildren = props => {
    const { children } = props
    try {
      const replies = React.Children.toArray(children).filter(
        e => e.type === Reply
      )
      const childrenWithoutReplies = React.Children.toArray(children).filter(
        e => ![Reply].includes(e.type)
      )
      return { replies, childrenWithoutReplies }
    } catch (e) {
      return { replies: [], childrenWithoutReplies: children }
    }
  }

  const WrappedComponent = props => {
    const { id, children, ...customMessageProps } = props
    const { replies, childrenWithoutReplies } = SplitChildren(props)
    return (
      <CustomMessage
        id={id}
        json={{
          ...customMessageProps,
          id,
          children: childrenWithoutReplies,
          customTypeName: name,
        }}
      >
        <CustomMessageComponent {...customMessageProps}>
          {childrenWithoutReplies}
        </CustomMessageComponent>
        {replies}
      </CustomMessage>
    )
  }
  WrappedComponent.customTypeName = name
  // eslint-disable-next-line react/display-name
  WrappedComponent.deserialize = msg => (
    <WrappedComponent id={msg.id} key={msg.key} json={msg.data} {...msg.data} />
  )
  return WrappedComponent
}
