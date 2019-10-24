import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"

const LinkedCta = ({ text, link }) => {
  const Container = styled.div`
    width: 140px;
    height: 42px;
    border: 2px solid #ff4689;
    border-radius: 4px;
    box-sizing: border-box;
    text-align: center;
    line-height: 37px;
    color: white;
    text-decoration: none;
    font-family: Palanquin;
  `
  const StyledLink = styled(Link)`
    text-decoration: none;
  `
  return (
    <StyledLink to={link}>
      <Container>
        <span>{text}</span>
      </Container>
    </StyledLink>
  )
}
LinkedCta.propTypes = {
  text: PropTypes.string,
  link: PropTypes.string,
}

LinkedCta.defaultProps = {
  text: "",
  link: "/",
}

export default LinkedCta
