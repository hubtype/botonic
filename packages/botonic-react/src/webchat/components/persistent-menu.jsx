import React from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import LogoMenu from '../../assets/menuButton.svg'
import { Icon } from './common'

const ButtonsContainer = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  bottom: 0;
  text-align: center;
`

export const OpenedPersistentMenu = ({ onClick, options }) => {
  let closeLabel = 'Cancel'
  try {
    closeLabel = options.filter(opt => opt.closeLabel !== undefined)[0]
      .closeLabel
  } catch (e) {}
  return (
    <ButtonsContainer>
      {Object.values(options).map((e, i) => {
        return (
          e.label && (
            <Button
              onClick={onClick}
              url={e.url}
              webview={e.webview}
              payload={e.payload}
              key={i}
            >
              {Object.values(e.label)}
            </Button>
          )
        )
      })}
      <Button onClick={onClick}>{closeLabel}</Button>
    </ButtonsContainer>
  )
}

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 18px;
`

export const PersistentMenu = props => (
  <IconContainer onClick={props.onClick}>
    <Icon src={LogoMenu} />
  </IconContainer>
)

export default OpenedPersistentMenu
