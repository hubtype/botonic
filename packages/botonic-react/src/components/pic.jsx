import React from 'react'

import { isBrowser, isNode } from '@botonic/core'
import styled from 'styled-components'

const StyledPic = styled.div`
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: 222px;
  height: 140px;
  border-bottom: 1px solid #f1f0f0;
`

export const Pic = props => {
  const renderBrowser = () => (
    <StyledPic
      style={{
        background: `#fff url(${props.src}) no-repeat center/cover`
      }}
    />
  )
  const renderNode = () => <pic>{props.src}</pic>
  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}

Pic.serialize = picProps => {
  return { pic: picProps.src }
}
