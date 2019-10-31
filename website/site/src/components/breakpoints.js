import React from "react"
import Breakpoint from "react-socks"
import { Flex } from "@rebass/grid"
import styled from "styled-components"

const D = props => (
  <Breakpoint medium up {...props}>
    {props.children}
  </Breakpoint>
)

const M = props => (
  <Breakpoint small down {...props}>
    {props.children}
  </Breakpoint>
)

const DesktopFlex = styled(Flex)`
  @media (max-width: 512px) {
    display: none !important;
  }
`

const MobileFlex = styled(Flex)`
  @media (min-width: 512px) {
    display: none !important;
  }
`

export { D, M, DesktopFlex, MobileFlex }
