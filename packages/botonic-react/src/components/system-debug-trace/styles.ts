import styled from 'styled-components'

export const StyledDebugEventContainer = styled.div`
  background-color: #ffffff;
  border-radius: 4px;
  padding: 4px 12px;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    sans-serif;
  box-sizing: border-box;
  margin: 8px;
  max-width: calc(100% - 16px);

  &.expanded {
    border: 1px solid #e8e8ea;
    padding: 4px 0;
  }
`

export const StyledDebugEventHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0;
  user-select: none;

  .expanded & {
    padding: 0 12px;
  }

  &:hover {
    opacity: 0.8;
  }
`

export const StyledDebugEventArrow = styled.span`
  font-size: 12px;
  color: #666a7a;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  text-align: center;
  flex-shrink: 0;
  line-height: 0;
`

export const StyledDebugEventIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  margin-right: 8px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`

export const StyledDebugEventTitle = styled.span`
  font-weight: 600;
  font-size: 12px;
  color: #393b45;
  line-height: 1.5;
  white-space: nowrap;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;

  span {
    font-weight: 400;
  }
`

export const StyledDebugEventContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.5;
  color: #393b45;
`

export const StyledDebugDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 32px;
  line-height: 1.5;
`

export const StyledDebugLabel = styled.strong`
  color: #393b45;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.5;
`

export const StyledDebugValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  font-weight: 600;
  font-size: 12px;
  color: #393b45;
  line-height: 1.5;
`

export const StyledDebugValueIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  color: #6d6a78;

  svg {
    width: 100%;
    height: 100%;
  }
`

export const StyledDebugMetadata = styled.div`
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e8e8ea;
  color: #393b45;
  font-size: 12px;
  padding: 0 32px;

  > div {
    margin-top: 6px;
    font-weight: 400;
  }
`
