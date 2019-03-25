import React from 'react'
import { Message } from './message'

export const Text = props => (
  <Message {...props} type='text'>
    {props.children}
  </Message>
)
