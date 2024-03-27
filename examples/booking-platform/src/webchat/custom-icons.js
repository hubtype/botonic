import React from 'react'
import styled from 'styled-components'
import { IconContainer } from './common'
import Send from '../assets/send.svg'
import BurgerMenu from '../assets/burger-menu.svg'
import { staticAsset } from '@botonic/react'

export const Icon = styled.img`
  width: 18px;
`

export const CustomSendButton = () => (
  <IconContainer>
    <Icon src={staticAsset(Send)} />
  </IconContainer>
)

export const CustomMenuButton = () => (
  <IconContainer>
    <Icon src={staticAsset(BurgerMenu)} />
  </IconContainer>
)
