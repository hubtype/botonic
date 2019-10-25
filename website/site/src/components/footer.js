import { useStaticQuery, graphql } from "gatsby"
import React from "react"
import Img from "gatsby-image"
import styled from "styled-components"
import LightLink from "./common/LightLink"

const Footer = () => {
  const { languageIcon } = useStaticQuery(
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

  const Container = styled.div`
    padding: 29px 60px;
    display: flex;
  `
  const InnerLeft = styled.div`
    display: flex;
  `
  const InnerRight = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-grow: 1; 
    color: #BEBED2;
    font-family: Heebo;
  `
  return (
    <footer>
      <Container>
        <InnerLeft>
          <Img
            fixed={languageIcon.childImageSharp.fixed}
            style={{ marginTop: "4px", marginRight: "4px" }}
          />
          <LightLink text={"English"} link={"/privacy-policy/"} />
          <LightLink text={"Privacy Policy"} link={"/privacy-policy/"} />
          <LightLink text={"Cookies"} link={"/cookies/"} />
          <LightLink text={"Terms of service"} link={"/terms-of-service/"} />
        </InnerLeft>

        <InnerRight>
          <span>© {new Date().getFullYear()} All rights reserved</span>
        </InnerRight>
      </Container>
    </footer>
  )
}

export default Footer
