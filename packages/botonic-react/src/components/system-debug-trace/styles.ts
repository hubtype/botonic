import styled from 'styled-components'

import { COLORS } from '../../constants'

export const StyledDebugContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  gap: 12px;

  background-color: ${COLORS.SOLID_WHITE};
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
  margin: 4px 8px;
  max-width: calc(100% - 16px);
  width: 100%;

  /* When collapsible (expanded or collapsed), entire container is hoverable and clickable */
  &.collapsible {
    cursor: pointer;

    &:hover {
      background-color: ${COLORS.N50};
    }
  }
`

export const StyledDebugHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  user-select: none;
  border-radius: 6px;
  padding: 8px 12px;
  width: 100%;

  /* Default hover for non-collapsible headers */
  &:hover {
    background-color: ${COLORS.N50};
  }

  /* For collapsible components, header should not have its own hover - container handles it */
  .collapsible & {
    &:hover {
      background-color: transparent;
    }
  }
`

export const StyledDebugArrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`

export const StyledDebugIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`

export const StyledDebugTitle = styled.span`
  flex: 1;
  display: flex;
  align-items: center;

  font-weight: 600;
  font-size: 12px;
  color: ${COLORS.N700};
  line-height: 1.5;
  white-space: nowrap;
  gap: 4px;

  span {
    font-weight: 400;
  }
`

export const StyledDebugContent = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  font-size: 12px;
  line-height: 1.5;
  color: ${COLORS.N700};
`
interface StyledDebugDetailProps {
  $isLastItem?: boolean
}
export const StyledDebugDetail = styled.div<StyledDebugDetailProps>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 28px;
  margin-bottom: ${({ $isLastItem }) => ($isLastItem ? '0' : '8px')};
  line-height: 1.5;
`

export const StyledDebugLabel = styled.strong`
  color: ${COLORS.N700};
  font-weight: 400;
  font-size: 12px;
  line-height: 1.5;
`

export const StyledDebugValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 12px;
  color: ${COLORS.N700};
  line-height: 1.5;

  > svg {
    width: 14px;
    height: 14px;
    min-width: 14px;
    min-height: 14px;
    flex-shrink: 0;
    display: block;
  }
`

export const StyledDebugItemWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  font-weight: 600;
  font-size: 12px;
  color: ${COLORS.N700};
  line-height: 1.5;

  &:not(:last-child) {
    margin-bottom: 4px;
  }

  > svg {
    width: 14px;
    height: 14px;
    min-width: 14px;
    min-height: 14px;
    flex-shrink: 0;
    display: block;
  }
`

export const StyledDebugMetadata = styled.div`
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid ${COLORS.N100};
  color: ${COLORS.N700};
  font-size: 12px;
  padding-left: 28px;

  > div {
    margin-top: 6px;
    font-weight: 400;
  }
`

export const StyledSeeChunksButton = styled.button`
  border: 1px solid #c4c6d0;
  border-radius: 6px;
  padding: 8px;
  height: 28px;
  background-color: transparent;
  color: #413f48;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  cursor: pointer;
  margin-left: 0;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;

  &:hover {
    background-color: ${COLORS.N50};
  }
`
interface StyledGuardrailItemProps {
  $isLastItem?: boolean
}
export const StyledGuardrailItem = styled.div<StyledGuardrailItemProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 28px;
  margin-bottom: ${({ $isLastItem }) => ($isLastItem ? '0' : '8px')};
  font-size: 12px;
  line-height: 1.5;
  color: ${COLORS.N700};

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`

export const StyledDebugContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;

  /* Create line from first label to last label */
  &::before {
    content: '';
    position: absolute;
    left: 13px;
    width: 1px;
    background-color: ${COLORS.N100};
    top: 0;
    /* Height ends at last label's bottom position */
    height: var(--last-label-bottom, 100%);
  }
`

export const StyledGuardrailLabel = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 1.5;
  color: ${COLORS.N700};
`

export const StyledGuardrailValue = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 1.5;
  color: ${COLORS.N700};
`

export const StyledSourceValue = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 1.5;
  color: ${COLORS.N700};
`

export const StyledFileSourceValue = styled(StyledSourceValue)`
  display: block;
`

export const StyledUrlSourceValue = styled.a`
  font-weight: 600;
  font-size: 12px;
  line-height: 1.5;
  color: ${COLORS.N700};
  text-decoration: none;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;

  &:hover {
    text-decoration: underline;
    color: ${COLORS.BOTONIC_BLUE};
  }

  &:visited {
    color: ${COLORS.N700};
  }
`
