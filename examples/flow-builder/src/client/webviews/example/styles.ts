import styled from 'styled-components'

import { colors, fontInterRegular } from '../../webchat/constants-styles'

export const BackgroundDesktop = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  > div:first-of-type {
    border-radius: 0px;
    background: ${colors.white};
    max-width: 390px;
    max-height: 620px;
    margin: 0px auto;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    z-index: 1;
  }
  > img:first-of-type {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 100vw;
    height: 100vh;
  }
`

export const WebviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 24px;

  color: ${colors.black};
  font-family: ${fontInterRegular};
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  height: 100%;
  width: 100%;
`
