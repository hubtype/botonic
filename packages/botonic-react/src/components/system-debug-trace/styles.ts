import styled from 'styled-components'

export const StyledDebugEventContainer = styled.div`
  margin: 8px;
  font-size: 15px;
  color: #4b5563;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
  max-width: calc(100% - 16px);
`

export const StyledDebugEventHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 8px 0;
  user-select: none;

  &:hover {
    opacity: 0.8;
  }
`

export const StyledDebugEventArrow = styled.span`
  font-size: 14px;
  color: #6b7280;
  display: inline-block;
  width: 16px;
  text-align: center;
  flex-shrink: 0;
`

export const StyledDebugEventTitle = styled.span`
  font-weight: 400;
  color: #374151;
  font-size: 15px;
  flex: 1;
`

export const StyledDebugEventContent = styled.div`
  margin-top: 12px;
  padding-left: 0;
  font-size: 14px;
  line-height: 1.7;
  color: #4b5563;
`

export const StyledDebugDetail = styled.div`
  margin-top: 10px;
  line-height: 1.6;
`

export const StyledDebugLabel = styled.strong`
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
`

export const StyledDebugValue = styled.span`
  color: #111827;
  font-weight: 400;
`

export const StyledDebugMetadata = styled.div`
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 13px;

  > div {
    margin-top: 6px;
  }
`
