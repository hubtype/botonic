import { getBotonicApp, WebchatContext } from '@botonic/react'
import * as React from 'react'

import { RESTART_CONVERSATION_PAYLOAD } from '../../../server/constants'
import { MenuBarsSvg } from '../svgs/menu-bars-svg'
import { downloadTranscript } from './download-transcript'
import { HeaderMenu } from './header-menu'
import { ModalStatus } from './index'
import { HeaderButton } from './styles'

interface HeaderMenuButtonProps {
  setIsDownloading: (isDownloading: boolean) => void
  setIsSuccessfulDownload: (IsSuccessfulDownload: boolean) => void
  setModalStatus: (modalStatus: ModalStatus) => void
}

export const HeaderMenuButton = ({
  setIsDownloading,
  setIsSuccessfulDownload,
  setModalStatus,
}: HeaderMenuButtonProps) => {
  const contextWebchat = React.useContext(WebchatContext)
  const [isMenuOpen, setMenuOpen] = React.useState(false)

  const handleClickMenu = () => {
    setMenuOpen(!isMenuOpen)
  }

  const openLeaveChatModal = () => {
    setModalStatus(ModalStatus.LEAVE_CHAT)
  }

  const openDownloadModal = async () => {
    setIsDownloading(true)
    setModalStatus(ModalStatus.DOWNLOAD_TRANSCRIPT)
    try {
      await downloadTranscript()
      setIsSuccessfulDownload(true)
      setIsDownloading(false)
    } catch (e) {
      setIsSuccessfulDownload(false)
      setIsDownloading(false)
    }
  }

  const handleStartOver = () => {
    getBotonicApp().clearMessages()
    void contextWebchat.sendPayload(RESTART_CONVERSATION_PAYLOAD)
  }

  const idBase = 'menu-header'

  return (
    <HeaderButton
      backgroundDark={isMenuOpen}
      id={`${idBase}-button`}
      onClick={handleClickMenu}
    >
      <MenuBarsSvg idBase={idBase} />
      {isMenuOpen && (
        <HeaderMenu
          handleClickMenu={handleClickMenu}
          isMenuOpen={isMenuOpen}
          openDownloadModal={openDownloadModal}
          openLeaveChatModal={openLeaveChatModal}
          startOver={handleStartOver}
        />
      )}
    </HeaderButton>
  )
}
