import styled from 'styled-components'

interface StyledTextareaProps {
  fontSize: string
  paddingLeft: boolean
}

export const StyledTextarea = styled.input<StyledTextareaProps>`
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
  align-items: center;
  border: none;
  font-family: inherit;
  font-size: ${props => props.fontSize};
  outline: 1px solid black;
  border-radius: 6px;
  overflow: auto;
  padding: 10px;
  padding-left: ${props => (props.paddingLeft ? 0 : '10px')};
  resize: none;
  width: 100%;
`
