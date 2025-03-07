import styled from 'styled-components'

import { COLORS, WEBCHAT } from '../constants'

export const StyledWebchat = styled.div`
  position: fixed;
  right: ${props => props.theme.style.right};
  bottom: ${props => props.theme.style.bottom};
  width: ${props => props.theme.style.width};
  height: ${props => props.theme.style.height};
  margin: auto;
  background-color: ${props => props.theme.style.backgroundColor};
  border-radius: 10px;
  box-shadow: ${props => props.theme.style.boxShadow};
  font-family: ${props => props.theme.style.fontFamily};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;

  @media (max-width: ${props => props.theme.mobileBreakpoint}px) {
    position: ${props => props.theme.mobileStyle.position};
    right: ${props => props.theme.mobileStyle.right};
    bottom: ${props => props.theme.mobileStyle.bottom};
    width: ${props => props.theme.mobileStyle.width};
    height: ${props => props.theme.mobileStyle.height};
    border-radius: ${props => props.theme.mobileStyle.borderRadius};
    font-size: ${props => props.theme.mobileStyle.fontSize};
  }
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
