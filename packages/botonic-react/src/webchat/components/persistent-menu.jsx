import React, { useContext } from 'react'
import styled from 'styled-components'

import LogoMenu from '../../assets/menuButton.svg'
import { Button } from '../../components/button'
import { ROLES, WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { useComponentVisible } from '../hooks'
import { Icon } from './common'

const ButtonsContainer = styled.div`
  position: absolute;
  z-index: 2;
  width: 100%;
  bottom: 0;
  text-align: center;
`

export const OpenedPersistentMenu = ({ onClick, options, borderRadius }) => {
  const { ref, isComponentVisible } = useComponentVisible(true, onClick)
  const { getThemeProperty } = useContext(WebchatContext)
  const CustomPersistentMenu = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.customPersistentMenu,
    undefined
  )
  let closeLabel = 'Cancel'
  try {
    closeLabel = options.filter(opt => opt.closeLabel !== undefined)[0]
      .closeLabel
  } catch (e) {}
  return (
    <div ref={ref} role={ROLES.PERSISTENT_MENU}>
      {isComponentVisible && CustomPersistentMenu ? (
        <CustomPersistentMenu onClick={onClick} options={options} />
      ) : (
        <ButtonsContainer>
          {Object.values(options).map((e, i) => {
            return (
              e.label && (
                <Button
                  onClick={onClick}
                  url={e.url}
                  target={e.target}
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
  <IconContainer role={ROLES.PERSISTENT_MENU_ICON} onClick={props.onClick}>
    <Icon src={LogoMenu} />
  </IconContainer>
)

export default OpenedPersistentMenu
