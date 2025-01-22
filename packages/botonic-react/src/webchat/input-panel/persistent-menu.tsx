import React, { useContext } from 'react'

import LogoMenu from '../../assets/menuButton.svg'
import { ROLES, WEBCHAT } from '../../constants'
import { WebchatContext } from '../../webchat/context'
import { Icon } from '../components/common'
import { ConditionalAnimation } from '../components/conditional-animation'

interface PersistentMenuProps {
  persistentMenu: any
  onClick: () => void
}

export const PersistentMenu = ({
  onClick,
  persistentMenu,
}: PersistentMenuProps) => {
  const { getThemeProperty } = useContext(WebchatContext)

  const persistentMenuOptions = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.persistentMenu,
    persistentMenu
  )

  const CustomMenuButton = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.customMenuButton,
    undefined
  )

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
