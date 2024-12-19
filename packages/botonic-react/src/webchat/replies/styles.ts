import styled from 'styled-components'

export const ScrollableReplies = styled.div`
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
`

interface RepliesContainerProps {
  justify: string
  wrap: string
}

export const RepliesContainer = styled.div<RepliesContainerProps>`
  display: flex;
  text-align: center;
  justify-content: ${props => props.justify};
  flex-wrap: ${props => props.wrap};
  padding-bottom: 10px;
  margin-left: 5px;
  margin-right: 5px;
  overflow-x: auto;
`

export const ReplyContainer = styled.div`
  flex: none;
  display: inline-block;
  margin: 3px;
`
