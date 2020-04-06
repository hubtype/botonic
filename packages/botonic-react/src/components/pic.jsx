import React from 'react'

import styled from 'styled-components'
import { COLORS } from '../constants'
import { renderComponent } from '../utils'

const PicStyled = styled.div`
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: 222px;
  height: 140px;
  background: ${COLORS.SOLID_WHITE} url(${props => props.src}) no-repeat
    center/cover;
  border-bottom: 1px solid ${COLORS.SEASHELL_WHITE};
`

export const Pic = props => {
  const renderBrowser = () => <PicStyled src={props.src} />
  const renderNode = () => <pic>{props.src}</pic>
  return renderComponent({ renderBrowser, renderNode })
}

Pic.serialize = picProps => {
  return { pic: picProps.src }
}
