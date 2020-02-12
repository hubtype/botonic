import React from 'react'
import { Message } from './message'

const serialize = textProps => {
  let text = String(textProps.children)
  /* As text message can have multiple children ( a text with buttons or quickreplies )
    we only want to store the text, we don't want to store the buttons or quickreplies.
    If we have an array of string, we want to join all the string as a single string, for
    future render actions
  */
  if (Array.isArray(textProps.children))
    text = textProps.children.filter(n => !n.type).join(' ')
  return { text }
}

export const Text = props => (
  <Message json={serialize(props)} {...props} type='text'>
    {props.children}
  </Message>
)

Text.serialize = serialize
