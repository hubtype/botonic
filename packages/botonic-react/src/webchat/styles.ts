import styled from 'styled-components'

import { COLORS, WEBCHAT } from '../constants'

interface StyledWebchatProps {
  width: number
  height: number
}

export const StyledWebchat = styled.div<StyledWebchatProps>`
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  margin: auto;
  background-color: ${COLORS.SOLID_WHITE};
  border-radius: 10px;
  box-shadow: ${COLORS.SOLID_BLACK_ALPHA_0_2} 0px 0px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`

export const ErrorMessageContainer = styled.div`
  position: relative;
  display: flex;
  z-index: 1;
  justify-content: center;
  width: 100%;
`

export const ErrorMessage = styled.div`
  position: absolute;
  top: 10px;
  font-size: 14px;
  line-height: 20px;
  padding: 4px 11px;
  display: flex;
  background-color: ${COLORS.ERROR_RED};
  color: ${COLORS.CONCRETE_WHITE};
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  font-family: ${WEBCHAT.DEFAULTS.FONT_FAMILY};
`

export const DarkBackgroundMenu = styled.div`
  background: ${COLORS.SOLID_BLACK};
  opacity: 0.3;
  z-index: 1;
  right: 0;
  bottom: 0;
  border-radius: 10px;
  position: absolute;
  width: 100%;
  height: 100%;
`
