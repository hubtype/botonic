import React from 'react'
import styled from 'styled-components'
import { Button } from '../../components/button'
import LogoMenu from '../../assets/menuButton.svg'
import { Icon } from './common'
import { useComponentVisible } from '../hooks'

const ButtonsContainer = styled.div`
  position: absolute;
  z-index: 2;
  width: 100%;
  bottom: 0;
  text-align: center;
`

export const OpenedPersistentMenu = ({ onClick, options, borderRadius }) => {
  const { ref, isComponentVisible } = useComponentVisible(true, onClick)
  let closeLabel = 'Cancel'
  try {
    closeLabel = options.filter(opt => opt.closeLabel !== undefined)[0]
      .closeLabel
  } catch (e) {}
  return (
    <div ref={ref}>
      {isComponentVisible && (
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
                  {e.label}
                </Button>
              )
            )
          })}
          <Button onClick={onClick} bottomRadius={borderRadius}>
            {closeLabel}
          </Button>
        </ButtonsContainer>
      )}
    </div>
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
