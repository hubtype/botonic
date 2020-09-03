import React from 'react'
import { Message } from './message'
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
    const { id, ...customMessageProps } = props
    return (
      <CustomMessage id={id} json={{ ...props, customTypeName: name }}>
        <CustomMessageComponent {...customMessageProps}>
          {props.children}
        </CustomMessageComponent>
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
