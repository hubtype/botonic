import React from 'react'
import styled from 'styled-components'

import { renderComponent } from '../util/react'
import { COMPONENT_DISPLAY_NAMES } from './constants'

const TitleContainer = styled.div`
  font-size: 14px;
  padding: 10px 15px;
`
export interface TitleProps {
  children: React.ReactNode
}

export const Title = (props: TitleProps) => {
  const renderBrowser = () => <TitleContainer>{props.children}</TitleContainer>

  const renderNode = () => <title>{props.children}</title>

  return renderComponent({ renderBrowser, renderNode })
}

Title.displayName = COMPONENT_DISPLAY_NAMES.Title

Title.serialize = (props: TitleProps) => {
  return { title: props.children }
}
