import * as React from 'react'

import { ModalContainer, StyledModal } from './styles'

interface ModalProps {
  children?: React.ReactElement
}
export const Modal = ({ children }: ModalProps): React.ReactElement => {
  return (
    <ModalContainer>
      <StyledModal>{children}</StyledModal>
    </ModalContainer>
  )
}
