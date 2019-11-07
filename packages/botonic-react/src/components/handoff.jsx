import React, { useState, useContext } from 'react'
import { WebchatContext } from '../contexts'
import styled from 'styled-components'

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
  background-color: white;
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

  let bgColor = state.showContinue ? '#c6e7c0' : '#d1d8cf'
  let fontColor = state.showContinue ? '#3a9c35' : '#5f735e'
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
