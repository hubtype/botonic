import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const PlainLink = ({ text, link, style }) => {
  const StyledLink = styled(Link)`
    color: white;
    text-decoration: none;
    font-family: Palanquin;
    ${style}
  `
  return <StyledLink to={link}>{text}</StyledLink>
}
PlainLink.propTypes = {
  text: PropTypes.string,
  link: PropTypes.string
}

PlainLink.defaultProps = {
  text: '',
  link: '/'
}
export default PlainLink
