import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'
import { staticAsset, getProperty } from '../utils'
import styled from 'styled-components'
import Logo from '../assets/botonic_react_logo100x100.png'
import { Flex } from '@rebass/grid'

const HeaderTitle = styled(Flex)`
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans+JP');
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
`

const Subtitle = styled(Flex)`
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans+JP');
  font-family: Arial, Helvetica, sans-serif;
  font-size: 11px;
  color: #ffffff;
`
const Diffuse = styled(Flex)`
  background: linear-gradient(90deg, #2e203b 0%, ${props => props.color} 100%);
  height: 55px;
  border-radius: 6px 6px 0px 0px;
`
const CloseHeader = styled.div`
  padding: 0px 16px;
  cursor: pointer;
  color: white;
  font-family: sans-serif;
  font-size: 36px;
`
const StyledHeaderImage = styled(Flex)`
  padding: 10px;
  align-items: center;
`
const StyledHeaderTitle = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  flex: 1 1 auto;
`

export const DefaultHeader = props => {
  const { webchatState, useTheme } = props
  const { theme } = webchatState
  let HeaderImage = Logo
  // These conditions are done in this way because HeaderImage can be null
  if (getProperty(theme, 'brand.image') || getProperty(theme, 'brandImage'))
    HeaderImage = useTheme('brand.image')
  if (getProperty(theme, 'header.image') || getProperty(theme, 'headerImage'))
    HeaderImage = useTheme('header.image')

  let headerTitle = useTheme('header.title') || 'Botonic'
  let headerSubtitle = useTheme('header.subtitle') || ''

  return (
    <Diffuse color={props.color}>
      {HeaderImage && (
        <StyledHeaderImage>
          <img
            style={{
              width: 32,
              borderRadius: '50%'
            }}
            src={staticAsset(HeaderImage)}
          />
        </StyledHeaderImage>
      )}
      <StyledHeaderTitle ml={HeaderImage ? 0 : 16}>
        <HeaderTitle mb={headerSubtitle ? '6px' : '0px'}>
          {headerTitle}
        </HeaderTitle>
        <Subtitle>{headerSubtitle}</Subtitle>
      </StyledHeaderTitle>
      <CloseHeader onClick={props.onCloseClick}>⨯</CloseHeader>
    </Diffuse>
  )
}
export const WebchatHeader = props => {
  const { webchatState, useTheme } = useContext(WebchatContext)
  const { theme } = webchatState
  const handleCloseWebchat = event => {
    props.onCloseClick(event.target.value)
  }
  let CustomHeader = useTheme('header.custom')
  if (CustomHeader) {
    return <CustomHeader />
  }
  return (
    <DefaultHeader
      webchatState={webchatState}
      useTheme={useTheme}
      color={useTheme('brand.color')}
      onCloseClick={handleCloseWebchat}
    />
  )
}
