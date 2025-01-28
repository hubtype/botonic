import * as React from 'react'

import { getLocalContents } from '../../../shared/locales'
import {
  ButtonsContainer,
  ModalText,
  ModalTitle,
  TextContainer,
} from '../modal/styles'
import { PrimaryButton, SecondaryButton } from '../shared-styles'

interface LeaveModalProps {
  handleLeaveClick: () => void
  handleStayClick: () => void
}

export const LeaveModal = ({
  handleLeaveClick,
  handleStayClick,
}: LeaveModalProps): React.ReactElement => {
  const contents = getLocalContents()
  return (
    <>
      <TextContainer>
        <ModalTitle>{contents.header.leaveModal.title}</ModalTitle>
        <ModalText>{contents.header.leaveModal.text} </ModalText>
      </TextContainer>
      <ButtonsContainer>
        <SecondaryButton onClick={handleStayClick}>
          {contents.header.leaveModal.stayButton}
        </SecondaryButton>
        <PrimaryButton onClick={handleLeaveClick}>
          {contents.header.leaveModal.leaveButton}
        </PrimaryButton>
      </ButtonsContainer>
    </>
  )
}
