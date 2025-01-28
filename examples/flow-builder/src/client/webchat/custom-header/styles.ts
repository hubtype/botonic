import styled from 'styled-components'

import { colors, fontInterBold, fontInterRegular } from '../constants-styles'

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: ${colors.main[500]};
  border-radius: 24px 24px 0px 0px;
  box-sizing: border-box;
  color: ${colors.white};
  padding: 16px;
  width: 100%;
  font-family: ${fontInterBold};

  @media (max-width: 650px) {
    border-radius: 0px;
  }
`

interface HeaderButtonProps {
  backgroundDark?: boolean
}

export const HeaderButton = styled.div<HeaderButtonProps>`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  background: ${props =>
    props.backgroundDark ? colors.main[600] : 'transparent'};
  width: 40px;
  height: 40px;
  border-radius: 50%;

  &:hover {
    background: ${colors.main[600]};
  }
`

export const HeaderTitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`

export const Floating = styled.div`
  position: relative;
  bottom: -30px;
  left: -30px;
`

export const Menu = styled.div`
  position: absolute;
  background: ${colors.white};
  border-radius: 16px;
  filter: drop-shadow(0px 4px 16px rgba(0, 0, 0, 0.12))
    drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.09))
    drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.08));
  width: 220px;
  z-index: 2;

  > div {
    border-bottom: 1px solid ${colors.neutral[50]};
  }
  > div:first-of-type {
    border-radius: none;
    border-radius: 16px 16px 0px 0px;
  }
  > div:last-of-type {
    border-bottom: none;
    border-radius: 0px 0px 16px 16px;
  }
`
export const Item = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;

  color: ${colors.neutral[500]};
  font-family: ${fontInterRegular};
  font-size: 14px;
  line-height: 21px;
  max-width: 208px;
  padding: 14px 24px;

  svg {
    flex-basis: 12%;
  }

  p {
    margin: 0px;
  }

  &:hover {
    background: ${colors.neutral[50]};
  }
`
