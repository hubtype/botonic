import styled from 'styled-components'

import { colors, fontInterSemiBold } from '../../../webchat/constants-styles'

interface HeaderContainerProps {
  withoutBorderRadius: boolean
}

export const HeaderContainer = styled.div<HeaderContainerProps>`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  background: ${colors.main[500]};
  border-radius: ${props =>
    props.withoutBorderRadius ? '0px' : '24px 24px 0px 0px'};
  box-sizing: border-box;
  color: ${colors.white};
  padding: 16px;
  width: 100%;
`

export const HeaderArrowButton = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 40px;
  height: 40px;
  border-radius: 50%;

  &:hover {
    background: ${colors.main[600]};
  }

  svg {
    width: 10px;
    height: 20px;
    margin-right: 2px;
  }
`

export const HeaderTitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`

export const HeaderTitleWhatsappContainer = styled(HeaderTitleContainer)`
  justify-content: space-between;
  width: 100%;
`

export const Title = styled.div`
  font-family: ${fontInterSemiBold};
  font-size: 18px;
  font-weight: 600;
  line-height: 27px;
`
