import { staticAsset } from '@botonic/react'
import * as React from 'react'

import { getLocalContents } from '../../../shared/locales'
import checkImage from '../../assets/check-circle.svg'
import loadingImage from '../../assets/spinner-third.svg'
import warningImage from '../../assets/warning.svg'
import {
  ButtonsContainer,
  Image,
  ModalOnlyTitle,
  ModalText,
  SimpleModal,
  SpinningImage,
  TextContainer,
  TitleContainer,
} from '../modal/styles'
import { PrimaryButton, SecondaryButton } from '../shared-styles'
interface DownloadModalProps {
  isDownloading: boolean
  isSuccessful: boolean
  handleLeaveClick: () => void
  handleStayClick: () => void
}

export const DownloadModal = ({
  isDownloading,
  isSuccessful,
  handleLeaveClick: handleClickLeave,
  handleStayClick,
}: DownloadModalProps): React.ReactElement => {
  const contents = getLocalContents()
  if (isDownloading) {
    return (
      <SimpleModal>
        <ModalOnlyTitle>
          {contents.header.downloadModal.downloading.title}
        </ModalOnlyTitle>
        <SpinningImage src={staticAsset(loadingImage as string)} />
      </SimpleModal>
    )
  }
  if (isSuccessful) {
    return (
      <>
        <TitleContainer>
          <Image src={staticAsset(checkImage as string)} />
          <ModalOnlyTitle>
            {contents.header.downloadModal.downloaded.title}
          </ModalOnlyTitle>
        </TitleContainer>
        <ButtonsContainer isColumn={true}>
          <SecondaryButton onClick={handleClickLeave}>
            {contents.header.downloadModal.downloaded.leaveChatButton}
          </SecondaryButton>
          <PrimaryButton onClick={handleStayClick}>
            {contents.header.downloadModal.downloaded.continueChatButton}
          </PrimaryButton>
        </ButtonsContainer>
      </>
    )
  }

  return (
    <>
      <TextContainer>
        <TitleContainer>
          <Image src={staticAsset(warningImage as string)} />
          <ModalOnlyTitle>
            {contents.header.downloadModal.error.title}
          </ModalOnlyTitle>
        </TitleContainer>
        <ModalText>
          <ModalText>{contents.header.downloadModal.error.text}</ModalText>
        </ModalText>
      </TextContainer>
      <ButtonsContainer isColumn={true}>
        <SecondaryButton onClick={handleStayClick}>
          {contents.header.downloadModal.error.continueChatButton}
        </SecondaryButton>
        <PrimaryButton onClick={handleClickLeave}>
          {contents.header.downloadModal.error.leaveChatButton}
        </PrimaryButton>
      </ButtonsContainer>
    </>
  )
}
