import styled, { css } from 'styled-components'

export const ScrollableContent = styled.div`
  ${props =>
    props.ismessagescontainer === 'true' &&
    css`
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
    `}
  overscroll-behavior: contain; // https://css-tricks.com/almanac/properties/o/overscroll-behavior/
  -webkit-overflow-scrolling: touch;
  /* ::-webkit-scrollbar { 
    // https://github.com/Grsmto/simplebar/issues/445#issuecomment-586902814
    display: none;
  } */
`
