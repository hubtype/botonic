import React from 'react'
import styled from 'styled-components'
import { Message } from './message'
import { isBrowser } from '@botonic/core'

const ImageStyled = styled.img`
  borderradius: 8px;
  maxwidth: 150px;
  maxheight: 150px;
  margin: 10px;
`

const serialize = imageProps => {
  return { image: imageProps.src }
}

export const Image = props => {
  let content = props.children
  if (isBrowser()) content = <ImageStyled src={props.src} />
  return (
    <Message json={serialize(props)} {...props} type="image">
      {content}
    </Message>
  )
}

Image.serialize = serialize
