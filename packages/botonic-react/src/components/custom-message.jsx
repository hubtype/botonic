import React from 'react'
import { Message } from './message'

export const customMessage = ({
  name,
  component: CustomMessageComponent,
  defaultProps,
}) => {
  // const CustomMessage = props => (
  //   <Message id={props.id} json={props.json} type='custom' style={style}>
  //     {props.children}
  //   </Message>
  // )
  const CustomMessage = props => (
    <Message {...defaultProps} {...props} type='custom' />
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
    <WrappedComponent id={msg.id} json={msg.data} {...msg.data} />
  )
  return WrappedComponent
}
