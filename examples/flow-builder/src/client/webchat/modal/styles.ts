import styled from 'styled-components'

import { colors, fontInterRegular } from '../constants-styles'

export const ModalContainer = styled.div`
  font-family: ${fontInterRegular};
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  border-radius: 24px;
  box-sizing: border-box;
  padding: 0px 30px;
`

export const StyledModal = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;

  background: ${colors.white};
  border-radius: 4px;
  width: 100%;
  max-height: 90%;
  padding: 24px;
`

export const ButtonsContainer = styled.div<{ isColumn?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: ${props => (props.isColumn ? 'column' : 'row')};
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`

export const SimpleModal = styled.div`
  width: 100%;
  height: 174px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`

export const ModalTitle = styled.div`
  color: ${colors.black};
  font-family: ${fontInterRegular};
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
`

export const ModalText = styled(ModalTitle)`
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  text-align: left;
  overflow-y: auto;
`

export const ModalOnlyTitle = styled(ModalTitle)`
  font-weight: 400;
`

export const SpinningImage = styled.img`
  width: 24px;
  height: 24px;
  margin-left: 10px;
  animation: rotation 1s infinite linear;
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-359deg);
    }
  }
`
export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
`

export const Image = styled.img`
  width: 16px;
  height: 24px;
  margin-right: 8px;
`
