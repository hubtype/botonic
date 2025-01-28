import styled from 'styled-components'

import { colors } from '../../../webchat/constants-styles'

export const SteperContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  padding: 24px 24px 0px 24px;
`
interface SteperItemProps {
  next?: boolean
}

export const StepItem = styled.div<SteperItemProps>`
  height: 4px;
  width: 100%;
  background: ${props =>
    props.next ? colors.neutral[100] : colors.neutral[500]};
  border-radius: 4px;
`
