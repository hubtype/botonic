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
  const { getThemeProperty } = props
  let HeaderImage = Logo
  /* 
  brand.image, brandImage, headerImage and header.image 
  can be set explicitly to null if the developer doesn't want to display them 
  */
  let brandImg = getThemeProperty('brand.image')
  if (brandImg !== undefined) HeaderImage = brandImg
  let headerImg = getThemeProperty('header.image')
  if (headerImg !== undefined) HeaderImage = headerImg

  let headerTitle = getThemeProperty('header.title') || 'Botonic'
  let headerSubtitle = getThemeProperty('header.subtitle') || ''

  return (
    <Diffuse color={props.color}>
      {HeaderImage && (
        <StyledHeaderImage>
          <img
            style={{
              width: 32,
              borderRadius: '50%',
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
  const { webchatState, getThemeProperty } = useContext(WebchatContext)

  const handleCloseWebchat = event => {
    props.onCloseClick(event.target.value)
  }
  let CustomHeader = getThemeProperty('header.custom')
  if (CustomHeader) {
    return <CustomHeader />
  }
  return (
    <DefaultHeader
      webchatState={webchatState}
      getThemeProperty={getThemeProperty}
      color={getThemeProperty('brand.color')}
      onCloseClick={handleCloseWebchat}
    />
  )
}
