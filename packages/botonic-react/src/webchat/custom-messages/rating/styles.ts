import styled from 'styled-components'

// TODO: Review how define all this styles
export const MessageBubble = styled.div`
  margin: 0px 0px 5px 0px;
`

interface RatingSelectorContainerProps {
  isSent?: boolean
}

export const RatingSelectorContainer = styled.div<RatingSelectorContainerProps>`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;

  & > div {
    cursor: ${props => (props.isSent ? 'default' : 'pointer')};

    svg {
      height: 27px;
      width: 27px;
    }
  }
`
