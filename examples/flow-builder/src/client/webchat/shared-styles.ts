import styled from 'styled-components'

import { colors } from './constants-styles'

const CustomButton = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${colors.main[500]};
  border-radius: 8px;
`

export const PrimaryButton = styled(CustomButton)`
  background: ${colors.main[500]};
  color: ${colors.white};
  &:hover {
    background: ${colors.main[600]};
    border: 1px solid ${colors.main[600]};
  }

  &:disabled {
    background: ${colors.main[200]};
    border: 1px solid ${colors.main[200]};
  }
`

export const SecondaryButton = styled(CustomButton)`
  background: ${colors.white};
  color: ${colors.main[500]};
  &:hover {
    background: ${colors.main[100]};
  }

  &:disabled {
    border: 1px solid ${colors.main[200]};
    color: ${colors.main[200]};
  }
`
