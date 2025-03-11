import styled from 'styled-components'

import { COLORS } from '../../constants'

export const BannerContainer = styled.div`
  color: ${COLORS.GRAY};
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
`

export const BannerText = styled.p`
  margin: 0;
`

export const BannerTextStrong = styled.strong`
  color: ${COLORS.GRAY};
  font-weight: 600;
`
