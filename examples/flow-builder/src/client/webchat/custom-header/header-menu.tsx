import * as React from 'react'

import { getLocalContents } from '../../../shared/locales'
import { useOnClickOutside } from '../hooks/use-on-click-outside'
import { ArrowRotateRightSvg } from '../svgs/arrow-rotate-right-svg'
import { FileArrowDown } from '../svgs/file-arrow-down-svg'
import { RightFromBracketSvg } from '../svgs/right-from-bracket-svg'
import { Floating, Item, Menu } from './styles'

interface HeaderMenuProps {
  openLeaveChatModal: () => void
  openDownloadModal: () => Promise<void>
  startOver: () => void
  isMenuOpen: boolean
  handleClickMenu: () => void
}

export const HeaderMenu = ({
  openLeaveChatModal,
  openDownloadModal,
  startOver,
  isMenuOpen,
  handleClickMenu,
}: HeaderMenuProps) => {
  const contents = getLocalContents()
  const menuOptions = [
    {
      title: contents.header.menuButton.startAgain,
      svg: <ArrowRotateRightSvg />,
      onClick: () => startOver(),
    },
    {
      title: contents.header.menuButton.downloadTranscript,
      svg: <FileArrowDown />,
      onClick: async () => await openDownloadModal(),
    },
    {
      title: contents.header.menuButton.leaveChat,
      svg: <RightFromBracketSvg />,
      onClick: () => openLeaveChatModal(),
    },
  ]

  const menuRef = React.useRef<HTMLInputElement>(null)

  useOnClickOutside(isMenuOpen, 'menu-header', () => handleClickMenu(), menuRef)

  return (
    <>
      <Floating>
        <Menu ref={menuRef}>
          {menuOptions.map((option, index) => (
            <Item onClick={option.onClick} key={`header-menu-item-${index}`}>
              {option.svg}
              <p>{option.title}</p>
            </Item>
          ))}
        </Menu>
      </Floating>
    </>
  )
}
