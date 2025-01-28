import { getBotonicApp } from '@botonic/react'
import * as React from 'react'

import { getLocalContents } from '../../../shared/locales'
import { Modal } from '../modal'
import { MinusSvg } from '../svgs/minus-svg'
import { DownloadModal } from './download-modal'
import { HeaderMenuButton } from './header-menu-button'
import { LeaveModal } from './leave-modal'
import { HeaderButton, HeaderContainer, HeaderTitleContainer } from './styles'

export enum ModalStatus {
  LEAVE_CHAT = 'LEAVE_CHAT',
  DOWNLOAD_TRANSCRIPT = 'DOWNLOAD_TRANSCRIPT',
  DISABLED = 'DISABLED',
}

export const CustomHeader = (props: any): React.ReactElement => {
  const [modalStatus, setModalStatus] = React.useState(ModalStatus.DISABLED)
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [isSuccessfulDownload, setIsSuccessfulDownload] = React.useState(false)
  const contents = getLocalContents()
  const handleMinify = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    props.onCloseClick(event)
    return
  }

  const handleStayClick = () => {
    setModalStatus(ModalStatus.DISABLED)
  }

  const handleLeaveClick = () => {
    getBotonicApp().close()
    getBotonicApp().clearMessages()
  }

  return (
    <>
      <HeaderContainer>
        <HeaderTitleContainer>
          <HeaderMenuButton
            setModalStatus={setModalStatus}
            setIsDownloading={setIsDownloading}
            setIsSuccessfulDownload={setIsSuccessfulDownload}
          />
          {contents.header.title}
        </HeaderTitleContainer>
        <HeaderButton onClick={handleMinify}>
          <MinusSvg />
        </HeaderButton>
      </HeaderContainer>

      {modalStatus !== ModalStatus.DISABLED && (
        <Modal>
          <>
            {modalStatus === ModalStatus.LEAVE_CHAT && (
              <LeaveModal
                handleStayClick={handleStayClick}
                handleLeaveClick={handleLeaveClick}
              />
            )}
            {modalStatus === ModalStatus.DOWNLOAD_TRANSCRIPT && (
              <DownloadModal
                isDownloading={isDownloading}
                isSuccessful={isSuccessfulDownload}
                handleStayClick={handleStayClick}
                handleLeaveClick={handleLeaveClick}
              />
            )}
          </>
        </Modal>
      )}
    </>
  )
}
