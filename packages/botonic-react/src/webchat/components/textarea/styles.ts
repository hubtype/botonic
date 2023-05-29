import styled from 'styled-components'

interface StyledTextareaProps {
  fontSize: string
  paddingLeft?: boolean
}

export const StyledTextarea = styled.textarea<StyledTextareaProps>`
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
  align-items: center;

  box-sizing: border-box;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: ${props => props.fontSize};
  overflow: auto;
  padding: 10px;
  padding-left: ${props => (props.paddingLeft ? 0 : '10px')};
  resize: none;
  max-height: 75px;
  width: 100%;
`
