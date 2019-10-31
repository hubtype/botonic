import React from 'react'
import styled from 'styled-components'
import LinkedCta from './common/LinkedCta'
import PlainLink from './common/PlainLink'
import BotonicLogo from '../images/botonic_logo_svg.svg'

const Container = styled.div`
  background: #464d65;
  padding: 29px 60px;
  display: flex;
`
const Inner = styled.div`
  padding: 16px 0px;
  display: flex;
  width: 33%;
`

const Header = ({ siteTitle }) => {
  return (
    <header>
      <Container fontFamily='Palanquin' color='white'>
        <Inner>
          <PlainLink
            text={'Docs'}
            link={'/docs/'}
            style={{ marginRight: '30px' }}
          />
          <PlainLink
            text={'Github'}
            link={'/github/'}
            style={{ marginRight: '30px' }}
          />
          <PlainLink text={'Slack'} link={'/slack/'} />
        </Inner>
        <Inner style={{ justifyContent: 'center' }}>
          <BotonicLogo />
        </Inner>
        <Inner style={{ justifyContent: 'flex-end' }}>
          <LinkedCta text={'GET STARTED'} link={'/get-started/'} />
        </Inner>
      </Container>
    </header>
  )
}

export default Header
