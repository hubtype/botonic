import styled from 'styled-components'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.css'

export const StyledSimpleBar = styled(SimpleBar)`
  & .simplebar-scrollbar::before {
    background-color: ${props =>
      props.scrollbar && props.scrollbar.thumb && props.scrollbar.thumb.color
        ? props.scrollbar.thumb.color
        : '#818181'};
    background-image: ${props =>
      props.scrollbar && props.scrollbar.thumb && props.scrollbar.thumb.bgcolor
        ? props.scrollbar.thumb.bgcolor
        : '#818181'};
    border-radius: ${props =>
      props.scrollbar && props.scrollbar.thumb && props.scrollbar.thumb.border
        ? props.scrollbar.thumb.border
        : '20px'};
  }
  & .simplebar-track .simplebar-scrollbar.simplebar-visible::before {
    opacity: ${props =>
      props.scrollbar && props.scrollbar.disabled
        ? '0'
        : props.scrollbar &&
          props.scrollbar.thumb &&
          props.scrollbar.thumb.opacity
        ? props.scrollbar.thumb.opacity
        : '0.75'};
  }
  & .simplebar-track {
    background-color: ${props =>
      props.scrollbar &&
      props.scrollbar.track &&
      props.scrollbar.track.color &&
      !(props.scrollbar && props.scrollbar.disabled)
        ? props.scrollbar.track.color
        : 'transparent'};
    background-image: ${props =>
      props.scrollbar &&
      props.scrollbar.track &&
      props.scrollbar.track.bgcolor &&
      !(props.scrollbar && props.scrollbar.disabled)
        ? props.scrollbar.track.bgcolor
        : 'transparent'};
    border-radius: ${props =>
      props.scrollbar && props.scrollbar.track && props.scrollbar.track.border
        ? props.scrollbar.track.border
        : '20px'};
  }
`
