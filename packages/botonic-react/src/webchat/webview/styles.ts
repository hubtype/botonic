import styled from 'styled-components'

import { COLORS, WEBCHAT } from '../../constants'

export const StyledWebview = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: ${COLORS.SOLID_WHITE};
  z-index: 2;
  border-radius: ${WEBCHAT.DEFAULTS.BORDER_RADIUS_TOP_CORNERS};
`

export const StyledWebviewHeader = styled.div`
  flex: none;
  text-align: right;
  background-color: ${COLORS.WILD_SAND_WHITE};
  border-top: 1px solid ${COLORS.SOLID_BLACK_ALPHA_0_2};
  border-bottom: 1px solid ${COLORS.SOLID_BLACK_ALPHA_0_2};
  border-radius: ${WEBCHAT.DEFAULTS.BORDER_RADIUS_TOP_CORNERS};
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
