import { useStaticQuery, graphql } from "gatsby"
import React from "react"
import Img from "gatsby-image"

const BotonicLogo = () => {
  const { botonicLogo } = useStaticQuery(
    graphql`
      query {
        botonicLogo: file(relativePath: { eq: "botonic-logo.png" }) {
          childImageSharp {
            fixed(width: 130, height: 35) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    `
  )
  return <Img fixed={botonicLogo.childImageSharp.fixed} />
}

export default BotonicLogo
