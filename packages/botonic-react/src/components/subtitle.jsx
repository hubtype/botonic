import React from 'react'
import styled from 'styled-components'
import { isBrowser, isNode } from '@botonic/core'
import { COLORS } from '../constants'

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

  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}

Subtitle.serialize = subtitleProps => {
  return { subtitle: subtitleProps.children }
}
