import styled from 'styled-components'

export const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-content: center;
  gap: 6px;
  cursor: pointer;
  width: ${props => props.theme.button?.style?.width};
  max-height: ${props => props.theme.button?.style?.maxHeight};
  height: ${props => props.theme.button?.style?.height};
  font-family: ${props => props.theme.style?.fontFamily};
  font-size: ${props => props.theme.button?.style?.fontSize};
  font-weight: ${props => props.theme.button?.style?.fontWeight};
  background: ${props => props.theme.button?.style?.background};
  color: ${props => props.theme.button?.style?.color};
  outline: ${props => props.theme.button?.style?.outline};
  border: ${props => props.theme.button?.style?.border};
  border-top-right-radius: ${props =>
    props.theme.button?.style?.borderTopRightRadius};
  border-top-left-radius: ${props =>
    props.theme.button?.style?.borderTopLeftRadius};
  border-bottom-right-radius: ${props =>
    props.theme.button?.style?.borderBottomRightRadius};
  border-bottom-left-radius: ${props =>
    props.theme.button?.style?.borderBottomLeftRadius};
  padding: ${props => props.theme.button?.style?.padding};
  overflow: ${props => props.theme.button?.style?.overflow};
  white-space: ${props => props.theme.button?.style?.whiteSpace};

  &:hover {
    background: ${props => props.theme.button?.hoverBackground};
    color: ${props => props.theme.button?.hoverTextColor};
  }

  &:disabled {
    opacity: ${props => props.theme.button?.disabledstyle?.opacity};
    cursor: ${props => props.theme.button?.disabledstyle?.cursor};
    pointer-events: ${props =>
      props.theme.button?.disabledstyle?.pointerEvents};
  }
`

export const StyledUrlImage = styled.img`
  width: 20px;
`
