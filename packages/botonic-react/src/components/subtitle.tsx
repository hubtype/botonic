import React from 'react'
import styled from 'styled-components'

import { COLORS } from '../constants'
import { renderComponent } from '../util/react'

const SubtitleContainer = styled.div`
  font-size: 12px;
  padding: 0px 15px 10px 15px;
  color: ${COLORS.MID_GRAY};
`

export interface SubtitleProps {
  children: React.ReactNode
}

export const Subtitle = (props: SubtitleProps) => {
  const renderBrowser = () => (
    <SubtitleContainer>{props.children}</SubtitleContainer>
  )

  const renderNode = () => <desc>{props.children}</desc>

  return renderComponent({ renderBrowser, renderNode })
}

Subtitle.serialize = (props: SubtitleProps) => {
  return { subtitle: props.children }
}
