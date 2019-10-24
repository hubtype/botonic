import { Link, useStaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { Flex } from "rebass"
import Img from "gatsby-image"

const Footer = () => {
  const { hubtypeLogo, languageIcon } = useStaticQuery(
    graphql`
      query {
        languageIcon: file(relativePath: { eq: "language-icon.png" }) {
          childImageSharp {
            fixed(width: 142) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    `
  )

  return (
    <footer>
      <Flex style={{ padding: "29px 60px 29px 60px", fontFamily: "Heebo", color: "#BEBED2", width:"100%", position:'fixed', bottom: 0}}> 
        <Flex >
          <Img
            fixed={languageIcon.childImageSharp.fixed}
            style={{ marginTop: "4px", marginRight: "4px" }}
          />
          <span style={{ marginRight: "4rem" }}>English</span>

          <Link to="/" style={{ color: "#BEBED2", textDecoration: "none", marginRight: "4rem" }}>
            Privacy policy
          </Link>

          <Link to="/" style={{ color: "#BEBED2", textDecoration: "none", marginRight: "4rem" }}>
            Cookies
          </Link>

          <Link to="/" style={{ color: "#BEBED2", textDecoration: "none", marginRight: "4rem" }}>
            Terms of service
          </Link>
        </Flex>
        <Flex flexGrow={1} justifyContent="flex-end">
          
          <span>© {new Date().getFullYear()} All rights reserved</span>
        </Flex>
      </Flex>
      
    </footer>
  )
}

export default Footer
