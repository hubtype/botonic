import React from 'react'
import { Message } from './message'
import { Reply } from './reply'
import { INPUT } from '@botonic/core'

export const customMessage = ({
  name,
  component: CustomMessageComponent,
  defaultProps,
}) => {
  const CustomMessage = props => (
    <Message {...defaultProps} {...props} type={INPUT.CUSTOM} />
  )
  const WrappedComponent = props => {
    const { id, children, ...customMessageProps } = props
    const replies = React.Children.toArray(children).filter(
      e => e.type === Reply
    )
    const childrenWithoutReplies = React.Children.toArray(children).filter(
      e => ![Reply].includes(e.type)
    )
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
    <WrappedComponent id={msg.id} json={msg.data} {...msg.data} />
  )
  return WrappedComponent
}
