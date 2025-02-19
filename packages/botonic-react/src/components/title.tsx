import React from 'react'
import styled from 'styled-components'

import { renderComponent } from '../util/react'

const TitleContainer = styled.div`
  font-size: 14px;
  padding: 10px 15px;
`

export const Title = props => {
  const renderBrowser = () => (
    <TitleContainer style={{ ...props.style }}>{props.children}</TitleContainer>
  )
  const renderNode = () => <title>{props.children}</title>

  return renderComponent({ renderBrowser, renderNode })
}

Title.serialize = titleProps => {
  return { title: titleProps.children }
}
