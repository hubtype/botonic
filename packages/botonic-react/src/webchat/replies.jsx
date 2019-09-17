import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'
import styled from 'styled-components'

const StyledReplies = styled.div`
  overflow-x: auto;
  padding-bottom: 10px;
  margin-left: 5px;
  margin-right: 5px;
`

const StyledRepliesContent = styled.div`
  display: inline-block;
  margin: 3px;
`

const alignOptions = /^left$|^center$|^right$/
const wrapOptions = /^wrap$|^no-wrap$/

export const WebchatReplies = props => {
  const { webchatState } = useContext(WebchatContext)
  return (
    <StyledReplies
      style={{
        textAlign: (props.align && props.align.match(alignOptions)) || 'center',
        whiteSpace: (props.wrap && props.wrap.match(wrapOptions)) || 'wrap',
        ...(props.style || {})
      }}
    >
      {webchatState.replies.map((r, i) => (
        <StyledRepliesContent key={i}>{r}</StyledRepliesContent>
      ))}
    </StyledReplies>
  )
}
