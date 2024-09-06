import 'simplebar/dist/simplebar.css'
import './styled-scrollbar.scss'

import SimpleBar from 'simplebar-react'
import styled, { css } from 'styled-components'

export const StyledScrollbar = styled(SimpleBar)`
  ${props =>
    props.ismessagescontainer === 'true' &&
    css`
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
    `}
`
