import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'
import styled from 'styled-components'
import Logo from './botonic_react_logo100x100.png'
import { Flex } from '@rebass/grid'

const HeaderTitle = styled.h1`
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans+JP');
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  line-height: 22px;
  color: #ffffff;
`

const Subtitle = styled.h1`
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans+JP');
  font-family: Arial, Helvetica, sans-serif;
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
const CloseHeader = styled(Flex)`
  position: absolute;
  right: 10px;
  top: 14px;
  padding: 5px;
  cursor: pointer;
  color: white;
  font-family: sans-serif;
  font-size: 18px;
`

export const DefaultHeader = props => {
  let HeaderImage = props.webchatState.theme.headerImage
  let headerTitle = props.webchatState.theme.headerTitle
  headerTitle = headerTitle || 'Botonic'
  let headerSubtitle = props.webchatState.theme.headerSubtitle
  return (
    <Diffuse color={props.color}>
      <Flex width={1 / 4}>
        {HeaderImage ? (
          <HeaderImage />
        ) : (
          <img
            style={{
              height: 24,
              paddingTop: 15,
              paddingLeft: 15
            }}
            src={Logo}
          />
        )}
      </Flex>
      <Flex width={1} flexDirection='column' justifyContent='center'>
        <HeaderTitle>{headerTitle}</HeaderTitle>
        <Subtitle>{headerSubtitle}</Subtitle>
      </Flex>
      <CloseHeader onClick={props.onChange}>X</CloseHeader>}
    </Diffuse>
  )
}

export const WebchatHeader = () => {
  const { webchatState } = useContext(WebchatContext)
  const handleCloseWebchat = event => {
    props.onChange(event.target.value)
  }
  if (webchatState.theme.customHeader) {
    let CustomHeader = webchatState.theme.customHeader
    return <CustomHeader />
  }

  return (
    <DefaultHeader
      webchatState={webchatState}
      color={webchatState.theme.brandColor}
      onChange={handleCloseWebchat}
    />
  )
}
