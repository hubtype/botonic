import styled from 'styled-components'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.css'

export const StyledScrollbar = styled(SimpleBar)`
  & .simplebar-scrollbar::before {
    background-color: ${({ scrollbar }) =>
      scrollbar && scrollbar.thumb && scrollbar.thumb.color
        ? scrollbar.thumb.color
        : '#818181'};
    background-image: ${({ scrollbar }) =>
      scrollbar && scrollbar.thumb && scrollbar.thumb.bgcolor
        ? scrollbar.thumb.bgcolor
        : '#818181'};
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
        : 'transparent'};
    background-image: ${({ scrollbar }) =>
      scrollbar &&
      scrollbar.track &&
      scrollbar.track.bgcolor &&
      !(scrollbar && !scrollbar.enable)
        ? scrollbar.track.bgcolor
        : 'transparent'};
    border-radius: ${({ scrollbar }) =>
      scrollbar && scrollbar.track && scrollbar.track.border
        ? scrollbar.track.border
        : '20px'};
  }
`
