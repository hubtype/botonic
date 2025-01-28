import styled from 'styled-components'

import { fontInterSemiBold } from '../../../webchat/constants-styles'

export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

export const ScrollContainer = styled.div`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  padding: 20px 24px;
  overflow-y: auto;
`

export const StepTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
  font-family: ${fontInterSemiBold};
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  width: 100%;
`
