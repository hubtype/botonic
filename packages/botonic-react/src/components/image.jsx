import { INPUT, isBrowser } from '@botonic/core'
import React, { useState } from 'react'
import styled from 'styled-components'

import { ROLES } from '../constants'
import { PortalModalComponent } from '../webchat/components/portal-modal'
import { Message } from './message'

const StyledImage = styled.img`
  border-radius: 8px;
  max-width: 150px;
  max-height: 150px;
  margin: -3px -6px;
  cursor: ${props => (props.isHovered ? 'zoom-in' : 'none')};
`

const StyledPreviewImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`

const serialize = imageProps => {
  return { image: imageProps.src }
}

export const Image = props => {
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpened, setIsModalOpened] = useState(false)

  let content = props.children

  if (isBrowser()) {
    content = (
      <>
        <StyledImage
          src={props.src}
          isHovered={isHovered}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsModalOpened(true)}
        />
        {isModalOpened && (
          <PortalModalComponent
            opened={isModalOpened}
            onClose={() => setIsModalOpened(false)}
            locked={false}
          >
            <StyledPreviewImage src={props.src} />
          </PortalModalComponent>
        )}
      </>
    )
  }
  return (
    <Message
      role={ROLES.IMAGE_MESSAGE}
      json={serialize(props)}
      {...props}
      type={INPUT.IMAGE}
    >
      {content}
    </Message>
  )
}

Image.serialize = serialize
