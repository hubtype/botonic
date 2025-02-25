import React from 'react'
import styled from 'styled-components'

import { renderComponent } from '../util/react'

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

Title.serialize = (props: TitleProps) => {
  return { title: props.children }
}
