import styled from 'styled-components'

import { COLORS, WEBCHAT } from '../../constants'

export const HeaderContainer = styled.div`
  display: flex;
  background: linear-gradient(
    90deg,
    ${COLORS.BLEACHED_CEDAR_PURPLE} 0%,
    ${props => props.color} 100%
  );
  border-radius: ${WEBCHAT.DEFAULTS.BORDER_RADIUS_TOP_CORNERS};
  z-index: 2;
  height: inherit;
`

export const ImageContainer = styled.div`
  padding: 10px;
  align-items: center;

  img {
    width: 32px;
    border-radius: 50%;
  }
`

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1 1 auto;
`

export const Title = styled.div`
  display: flex;
  font-family: inherit;
  font-size: 15px;
  font-weight: bold;
  color: ${COLORS.SOLID_WHITE};
`

export const Subtitle = styled.div`
  display: flex;
  font-family: inherit;
  font-size: 11px;
  color: ${COLORS.SOLID_WHITE};
`

export const CloseHeader = styled.div`
  padding: 0px 16px;
  cursor: pointer;
  color: ${COLORS.SOLID_WHITE};
  font-family: inherit;
  font-size: 36px;
`

export const StyledWebchatHeader = styled.div`
  border-radius: 8px 8px 0px 0px;
  box-shadow: ${COLORS.PIGEON_POST_BLUE_ALPHA_0_5} 0px 2px 5px;
  height: 55px;
  flex: none;
`
