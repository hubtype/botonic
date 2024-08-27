import styled from 'styled-components'

import { COLORS } from '../../constants'

export const StyledTriggerButton = styled.div`
  cursor: pointer;
  position: fixed;
  background: ${COLORS.SOLID_WHITE};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 65px;
  height: 65px;
  bottom: 20px;
  right: 10px;
  padding: 8px;
`

export const UnreadMessagesCounter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 24px;
  height: 24px;
  background-color: ${COLORS.RED_NOTIFICATIONS};
  color: white;
  z-index: 10;
`

export const TriggerImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`
