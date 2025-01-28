import * as React from 'react'

import { Modal } from '../../../webchat/modal'
import { WhatsAppDesktopModal } from './styles'

interface WebviewModalProps {
  children?: React.ReactElement
  isWhatsAppDesktop: boolean
}

export const WebviewModal = ({
  children,
  isWhatsAppDesktop,
}: WebviewModalProps) => {
  return isWhatsAppDesktop ? (
    <WhatsAppDesktopModal>
      <Modal>{children}</Modal>
    </WhatsAppDesktopModal>
  ) : (
    <Modal>{children}</Modal>
  )
}
