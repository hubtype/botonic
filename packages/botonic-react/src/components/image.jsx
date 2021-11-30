import { INPUT, isBrowser } from '@botonic/core'
import React, { useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import styled from 'styled-components'

import { ROLES } from '../constants'
import { PortalModalComponent } from '../webchat/components/portal-modal'
import { Message } from './message'

const StyledImage = styled.img`
  border-radius: 8px;
  max-width: 150px;
  max-height: 150px;
  margin: -3px -6px;
  cursor: ${props => (props.isHovered ? 'pointer' : 'none')};
`

const StyledPreviewImage = styled.img`
  width: 100%;
  max-width: 75vw;
  max-height: 75vh;
  object-fit: contain;
`

const serialize = imageProps => {
  return { image: imageProps.src }
}

export const Image = props => {
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  let content = props.children

  if (isBrowser()) {
    content = (
      <>
        <StyledImage
          src={props.src}
          isHovered={isHovered}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsModalOpen(true)}
        />
        {isModalOpen && (
          <PortalModalComponent
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            locked={false}
          >
            <TransformWrapper
              initialScale={1}
              initialPositionX={0}
              initialPositionY={0}
              wheel={{ step: 0.05 }}
            >
              <TransformComponent>
                <StyledPreviewImage src={props.src} />
              </TransformComponent>
            </TransformWrapper>
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
