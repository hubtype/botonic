import React from 'react'
import { Message } from './message'

const serialize = textProps => {
  let text = textProps.children
  if (
    typeof textProps.children == 'object' &&
    typeof textProps.children[1] != 'string'
  ) {
    text = textProps.children[0]
  }
  return { text }
}

export const Text = props => (
  <Message json={serialize(props)} {...props} type='text'>
    {props.children}
  </Message>
)

Text.serialize = serialize
