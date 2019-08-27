import React, { useState, useContext } from 'react'
import { WebchatContext } from '../contexts'
import styled from 'styled-components'

const HandoffStyled = styled.div`
  display: flex;
  color: ${props => props.fontColor};
  fontfamily: Arial, Helvetica, sans-serif;
  flexdirection: column;
  justifycontent: center;
  alignitems: center;
  padding: 24px;
  background-color: ${props => props.bgColor};
`
const HandoffResponse = styled.div`
  text-align: center;
  white-space: normal;
`
const HandoffButton = styled.button`
  max-width: 60%;
  padding: 12px 24px;
  background-color: white;
  border: none;
  border-radius: 4;
  margin-top: 8;
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
    <HandoffStyled bgColor={bgColor} fontColor={fontColor}>
      {state.showContinue ? (
        <HandoffResponse>
          Conversation transferred to a human agent...
        </HandoffResponse>
      ) : (
        <HandoffResponse>Human handoff ended</HandoffResponse>
      )}
      {state.showContinue && (
        <HandoffButton onClick={continueClick}>Continue</HandoffButton>
      )}
    </HandoffStyled>
  )
}
