import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import { COLORS } from '../constants'
import { WebchatContext } from '../webchat/context'

const Container = styled.div`
  display: flex;
  font-family: inherit;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
`

const TransferredContainer = styled.div`
  text-align: center;
  white-space: normal;
`

const EndedContainer = styled.div`
  text-align: center;
  white-space: normal;
`

const StyledButton = styled.button`
  max-width: 60%;
  padding: 12px 24px;
  background-color: ${COLORS.SOLID_WHITE};
  border: none;
  border-radius: 4px;
  margin-top: 8px;
  cursor: pointer;
`

export const Handoff = props => {
  const { resolveCase } = useContext(WebchatContext)
  const [state, setState] = useState({ showContinue: true })

  const continueClick = () => {
    setState({ showContinue: false })
    resolveCase()
  }

  const bgColor = state.showContinue
    ? COLORS.FRINGY_FLOWER_GREEN
    : COLORS.TASMAN_GRAY
  const fontColor = state.showContinue
    ? COLORS.APPLE_GREEN
    : COLORS.CACTUS_GREEN
  return (
    <Container
      style={{
        color: fontColor,
        backgroundColor: bgColor,
      }}
    >
      {state.showContinue ? (
        <TransferredContainer>
          Conversation transferred to a human agent...
        </TransferredContainer>
      ) : (
        <EndedContainer>Human handoff ended</EndedContainer>
      )}
      {state.showContinue && (
        <StyledButton onClick={continueClick}>Continue</StyledButton>
      )}
    </Container>
  )
}
