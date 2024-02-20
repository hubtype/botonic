import 'simplebar/dist/simplebar.css'
import './styled-scrollbar.scss'

import SimpleBar from 'simplebar-react'
import styled, { css } from 'styled-components'

import { COLORS } from '../../constants'

export const StyledScrollbar = styled(SimpleBar)`
  ${props =>
    props.ismessagescontainer === 'true' &&
    css`
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
    `}
  & .simplebar-scrollbar::before {
    background-color: ${({ scrollbar }) =>
      scrollbar && scrollbar.thumb && scrollbar.thumb.color
        ? scrollbar.thumb.color
        : `${COLORS.GRAY}`};
    background-image: ${({ scrollbar }) =>
      scrollbar && scrollbar.thumb && scrollbar.thumb.bgcolor
        ? scrollbar.thumb.bgcolor
        : `${COLORS.GRAY}`};
    border-radius: ${({ scrollbar }) =>
      scrollbar && scrollbar.thumb && scrollbar.thumb.border
        ? scrollbar.thumb.border
        : '20px'};
  }
  & .simplebar-track .simplebar-scrollbar.simplebar-visible::before {
    opacity: ${({ scrollbar }) =>
      scrollbar && !scrollbar.enable
        ? '0'
        : scrollbar && scrollbar.thumb && scrollbar.thumb.opacity
          ? scrollbar.thumb.opacity
          : '0.75'};
  }
  & .simplebar-track {
    background-color: ${({ scrollbar }) =>
      scrollbar &&
      scrollbar.track &&
      scrollbar.track.color &&
      !(scrollbar && !scrollbar.enable)
        ? scrollbar.track.color
        : COLORS.TRANSPARENT};
    background-image: ${({ scrollbar }) =>
      scrollbar &&
      scrollbar.track &&
      scrollbar.track.bgcolor &&
      !(scrollbar && !scrollbar.enable)
        ? scrollbar.track.bgcolor
        : COLORS.TRANSPARENT};
    border-radius: ${({ scrollbar }) =>
      scrollbar && scrollbar.track && scrollbar.track.border
        ? scrollbar.track.border
        : '20px'};
  }
`
