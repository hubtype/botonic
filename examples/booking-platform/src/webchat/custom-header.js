import React, { useContext } from 'react'
import styled from 'styled-components'
import { IconContainer } from './common'
import Close from '../assets/cancel.svg'
import Comment from '../assets/comment.svg'
import { staticAsset } from '@botonic/react'

const Header = styled.div`
  height: 48px;
  background: #495e86;
  z-index: 2;
  display: flex;
  align-items: center;
`
const Title = styled.h1`
  font-family: inherit;
  font-size: 16px;
  font-weight: 400;
  line-height: 1px;
  color: #ffffff;
  width: 80%;
  margin: 0;
`

export const CustomHeader = () => {
  return (
    <Header>
      <IconContainer>
        <img
          style={{
            width: '22px',
          }}
          src={staticAsset(Comment)}
        />
      </IconContainer>
      <Title>Botonic Booking Platform</Title>
      <IconContainer
        onClick={() => {
          Botonic.close()
        }}
      >
        <img
          style={{
            width: '15px',
          }}
          src={staticAsset(Close)}
        />
      </IconContainer>
    </Header>
  )
}
