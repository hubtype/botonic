import React, { useContext } from 'react'

import LogoMenu from '../../assets/menuButton.svg'
import { ROLES } from '../../constants'
import { WebchatContext } from '../../webchat/context'
import { Icon } from '../components/common'
import { ConditionalAnimation } from '../components/conditional-animation'

interface PersistentMenuProps {
  onClick: () => void
}

export const PersistentMenu = ({ onClick }: PersistentMenuProps) => {
  const { webchatState } = useContext(WebchatContext)

  const persistentMenuOptions = webchatState.theme.userInput?.persistentMenu

  const CustomMenuButton = webchatState.theme.userInput?.menuButton?.custom

  return (
    <>
      {persistentMenuOptions ? (
        <ConditionalAnimation>
          <div role={ROLES.PERSISTENT_MENU_ICON} onClick={onClick}>
            {CustomMenuButton ? <CustomMenuButton /> : <Icon src={LogoMenu} />}
          </div>
        </ConditionalAnimation>
      ) : null}
    </>
  )
}
