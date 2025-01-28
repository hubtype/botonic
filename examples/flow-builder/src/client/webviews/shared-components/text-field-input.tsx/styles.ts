import styled from 'styled-components'

import { colors, fontInterRegular } from '../../../webchat/constants-styles'

interface InputTextProps {
  error: boolean
  fullWidth: boolean
}

export const InputTextContainer = styled.div<InputTextProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 4px;
  box-sizing: border-box;
  width: ${props => (props.fullWidth ? '100%' : 'auto')};

  label {
    color: ${colors.black};
    font-family: ${fontInterRegular};
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 21px;
  }

  input {
    border: 1px solid
      ${props => (props.error ? colors.red[700] : colors.neutral[500])};
    border-radius: 8px;
    padding: 12px 16px;
    box-sizing: border-box;
    width: 100%;
    font-size: 16px;

    &:focus-visible {
      outline-offset: 0px;
      outline: 1px solid
        ${props => (props.error ? colors.red[700] : colors.main[500])};
    }
  }

  p {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    color: ${colors.red[700]};
    font-family: ${fontInterRegular};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    margin: 0px;
  }
`
