import React from 'react'
import styled from 'styled-components'

import { resolveImage } from '../../util/environment'

const PointerImage = styled.img`
  cursor: pointer;
`
export const Icon = props => <PointerImage src={resolveImage(props.src)} />

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 15px;
`
