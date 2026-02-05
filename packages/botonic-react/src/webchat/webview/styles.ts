import styled from 'styled-components'

import { COLORS } from '../../constants'

export const StyledWebview = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: ${COLORS.SOLID_WHITE};
  z-index: 2;
  border-radius: ${props => props.theme.style.borderRadius};

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

export const StyledWebviewHeader = styled.div`
  flex: none;
  text-align: right;
  background-color: ${COLORS.WILD_SAND_WHITE};
  border-top: 1px solid ${COLORS.SOLID_BLACK_ALPHA_0_2};
  border-bottom: 1px solid ${COLORS.SOLID_BLACK_ALPHA_0_2};
  border-radius: ${props => props.theme.header?.style?.borderRadius};

  @media (max-width: ${props => props.theme.mobileBreakpoint}px) {
    border-radius: 0px;
  }
`
export const StyledCloseHeader = styled.div`
  display: inline-block;
  padding: 8px 12px;
  cursor: pointer;
`

export const StyledWebviewContent = styled.div`
  flex: 1;
  overflow: auto;
`

export const FrameStyles = `
  border-style: none;
  width: 100%;
  height: 100%;
`

export const StyledFrame = styled.iframe`
  ${FrameStyles}
`

export const StyledFrameAsDiv = styled.div`
  ${FrameStyles}
`
