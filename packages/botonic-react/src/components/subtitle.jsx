import React from 'react'
import styled from 'styled-components'

import { COLORS } from '../constants'
import { renderComponent } from '../util/react'

const SubtitleContainer = styled.div`
  font-size: 12px;
  padding: 0px 15px 10px 15px;
  color: ${COLORS.MID_GRAY};
`
export const Subtitle = props => {
  const renderBrowser = () => (
    <SubtitleContainer
      style={{
        ...props.style,
      }}
    >
      {props.children}
    </SubtitleContainer>
  )
  const renderNode = () => <desc>{props.children}</desc>

  return renderComponent({ renderBrowser, renderNode })
}

Subtitle.serialize = subtitleProps => {
  return { subtitle: subtitleProps.children }
}
