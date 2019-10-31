import React from "react"
import { graphql } from "gatsby"
import Header from "../components/header"
import Footer from "../components/footer"
import { DesktopFlex, MobileFlex } from "../components/breakpoints"
import { Flex } from "@rebass/grid"
import styled from "styled-components"

const Section = styled(Flex)``

const Title = styled.h1`
  color: white;
  font-family: Heebo;
  font-style: normal;
  font-size: 42px;
  line-height: 52px;
`
const Date = styled.h2`
  font-family: Heebo;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  /* identical to box height */

  color: #ffffff;
  margin-top: -10px;
`

const BlogContent = styled.div`
  font-family: Merriweather;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 30px;

  color: #caced9;
`

const Content = props => {
  return (
    <>
      <DesktopFlex>
        <Flex flexDirection="column" pt={52} pb={120} style={{ maxWidth: 635 }}>
          {props.children}
        </Flex>
      </DesktopFlex>
      <MobileFlex>
        <Flex flexDirection="column" mt={10} mb={60} pr={15} pl={15}>
          {props.children}
        </Flex>
      </MobileFlex>
    </>
  )
}

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  return (
    <>
      <Header />
      <Section justifyContent={["", "center"]}>
        <Content>
          <Title>{frontmatter.title}</Title>
          <Date>{frontmatter.date}</Date>
          <BlogContent dangerouslySetInnerHTML={{ __html: html }}></BlogContent>
        </Content>
      </Section>

      <Footer />
    </>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`
