import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'
import styled from 'styled-components'
import Logo from './botonic_react_logo100x100.png'
import { Flex } from '@rebass/grid'

const HeaderTitle = styled.h1`
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans+JP');
  font-size: 15px;
  line-height: 22px;
  color: #ffffff;
`

const Subtitle = styled.h1`
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans+JP');
  font-size: 11px;
  line-height: 16px;
  /* identical to box height */
  margin-top: -12px;
  color: #ffffff;
`
const Diffuse = styled(Flex)`
  background: linear-gradient(90deg, #2e203b 0%, ${props => props.color} 100%);
  width: 100%;
  height: 55px;
  border-radius: 6px 6px 0px 0px;
`

export const DefaultHeader = props => (
  <Diffuse color={props.color}>
    <Flex width={1 / 4}>
      <img
        style={{
          height: 24,
          paddingTop: 15,
          paddingLeft: 15
        }}
        src={Logo}
      />
    </Flex>
    <Flex width={1} flexDirection='column'>
      <HeaderTitle>Botonic</HeaderTitle>
      <Subtitle>Online</Subtitle>
    </Flex>
    <div
      style={{
        cursor: "pointer",
        fontSize: "16px",
        color: "black",
        position: "absolute",
        right: "10px",
        top: "9px"
      }}
      onClick={() => {
        toggleWebchat(false);
      }}
    >
      ✕
    </div>
  </Diffuse>
)

export const WebchatHeader = props => {
  const { webchatState, toggleWebchat } = useContext(WebchatContext);

  if (webchatState.theme.customHeader) {
    let CustomHeader = webchatState.theme.customHeader
    return <CustomHeader />
  }

  return <DefaultHeader color={webchatState.theme.brandColor} />
}
