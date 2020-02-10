import React from 'react'
import styled from 'styled-components'
import { staticAsset } from '../../utils'

const PointerImage = styled.img`
  cursor: pointer;
`
export const Icon = props => <PointerImage src={staticAsset(props.src)} />

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 15px;
`
