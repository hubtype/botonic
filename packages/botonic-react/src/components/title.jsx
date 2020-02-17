import React from 'react'
import styled from 'styled-components'
import { isBrowser, isNode } from '@botonic/core'

const TitleContainer = styled.div`
  font-size: 14px;
  padding: 10px 15px;
`

export const Title = props => {
  const renderBrowser = () => (
    <TitleContainer style={{ ...props.style }}>{props.children}</TitleContainer>
  )
  const renderNode = () => <title>{props.children}</title>

  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}

Title.serialize = titleProps => {
  return { title: titleProps.children }
}
