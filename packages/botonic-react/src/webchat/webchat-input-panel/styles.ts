import styled from 'styled-components'

import { COLORS } from '../../constants'

export const UserInputContainer = styled.div`
  min-height: 52px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  padding: 0px 16px;
  z-index: 1;
  border-top: 1px solid ${COLORS.SOLID_BLACK_ALPHA_0_5};
`
