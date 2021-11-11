import styled from 'styled-components'

import { MODAL_ACTIVE_CLASSNAME, MODAL_CONTENT_CLASSNAME } from './constants'

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(51, 51, 51, 0.3);
  backdrop-filter: blur(1px);
  opacity: 0;
  transition: all 100ms cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 200ms;
  display: flex;
  align-items: center;
  justify-content: center;

  & .${MODAL_CONTENT_CLASSNAME} {
    transform: translateY(100px);
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
  }

  &.${MODAL_ACTIVE_CLASSNAME} {
    transition-duration: 250ms;
    transition-delay: 0ms;
    opacity: 1;

    & .${MODAL_CONTENT_CLASSNAME} {
      transform: translateY(0);
      opacity: 1;
      transition-delay: 150ms;
      transition-duration: 350ms;
    }
  }
`
