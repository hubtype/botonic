import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"

const LightLink = ({ text, link, style }) => {
  const StyledLink = styled(Link)`
    color: #bebed2;
    text-decoration: none;
    margin-right: 4rem;
    font-family: Heebo;
    ${style}
  `
  return <StyledLink to={link}>{text}</StyledLink>
}
LightLink.propTypes = {
  text: PropTypes.string,
  link: PropTypes.string,
}

LightLink.defaultProps = {
  text: "",
  link: "/",
}
export default LightLink
