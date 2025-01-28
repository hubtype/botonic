import styled from 'styled-components'

import { colors } from '../constants-styles'

export const UserInputButton = styled.div`
  cursor: pointer;
  > svg {
    > path {
      fill: ${colors.neutral[500]};
    }
  }
`
