import React from 'react'
import { Message } from './message'

export const customMessage = ({
  name,
  component: CustomMessageComponent,
  serializer,
  deserializer
}) => {
  const CustomMessage = props => (
    <Message id={props.id} json={props.json} type='custom'>
      {props.children}
    </Message>
  )
  let WrappedComponent = props => {
    let { id, ...customMessageProps } = props
    return (
      <CustomMessage
        id={id}
        json={{ ...serializer(props), customTypeName: name }}
      >
        <CustomMessageComponent {...customMessageProps}>
          {props.children}
        </CustomMessageComponent>
      </CustomMessage>
    )
  }
  WrappedComponent.customTypeName = name
  WrappedComponent.deserialize = msg => (
    <CustomMessage id={msg.id} json={msg.data}>
      {deserializer(msg.data)}
    </CustomMessage>
  )
  return WrappedComponent
}
