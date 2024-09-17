import styled from 'styled-components'

export const StyledWebchatChatArea = styled.div<{ height: number }>`
  display: inherit;
  flex-direction: inherit;
  height: ${props => props.height}px;
  width: inherit;
  overflow: inherit;
`
