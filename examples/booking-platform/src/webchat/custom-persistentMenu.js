import React, { useContext } from 'react'
import styled from 'styled-components'
import { WebchatContext } from '@botonic/react'
import { CustomMenuButton } from './custom-persistentMenu-button'
import Home from '../assets/home.svg'
import CheckReservation from "../assets/check-reservation.svg"
import Close from "../assets/close.svg"
import { staticAsset } from '@botonic/react'

const ButtonsContainer = styled.div`
  width: 100%;
  bottom: 0;
  position: absolute;
  z-index: 2;
  text-align: center;
  background: white;
`

export const CustomPersistentMenu = ({ onClick, options }) => {
  return (
    <ButtonsContainer>
      <CustomMenuButton
        label={options[0].label}
        webview={options[0].webview}
        img={staticAsset(CheckReservation)}
      />
      <CustomMenuButton
        label={options[1].label}
        payload={options[1].payload}
        img={staticAsset(Home)}
      />
      <CustomMenuButton
        label={options[2].closeLabel}
        onClick={onClick}
        img={staticAsset(Close)}
      />
    </ButtonsContainer>
  )
}
