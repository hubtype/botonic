import React from "react"
import { graphql } from "gatsby"
import { Flex, Box } from "@rebass/grid"
import Header from "../components/header"
import Footer from "../components/footer"
import styled from "styled-components"
import Img from "gatsby-image"
import ReadMore from "../images/read_more.svg"

const StyledFeatured = styled.p`
  font-family: Heebo;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 23px;
  /* identical to box height */

  color: #ffffff;
`

const StyledFeaturedArticle = styled(Flex)`
  background: linear-gradient(0deg, #363d53 0%, rgba(70, 77, 101, 0) 100%);
  justify-content: center;
`
const StyledFeaturedTitle = styled.h1`
  font-family: Heebo;
  font-style: normal;
  font-weight: 500;
  font-size: 42px;
  line-height: 52px;

  color: #ffffff;
`

const Grid = styled(Flex)`
  display: grid;
  gap: 20px 20px;
  grid-template-columns: repeat(2, 1fr);
  @media (min-width: 512px) {
    gap: 40px 40px;
    grid-template-columns: repeat(3, 1fr);
  }
`

const Desc = styled.p`
  font-family: Heebo;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 26px;

  color: #ffffff;
`

const Date = styled.p`
  font-family: Heebo;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  /* identical to box height */

  color: #ffffff;
`

const FeaturedArticle = data => {
  let featuredBlog
  Object.values(data.data.allMarkdownRemark.nodes).map((e, i) => {
    if (e.frontmatter.isFeatured) {
      featuredBlog = e.frontmatter
    }
  })

  return (
    <StyledFeaturedArticle>
      <Flex ml={100} mr={100} pb={50} pt={50}>
        <Box width={1 / 2} p={40} flexDirection="column">
          <StyledFeatured>FEATURED ARTICLE</StyledFeatured>
          <StyledFeaturedTitle>{featuredBlog.title}</StyledFeaturedTitle>
          <Flex>
            <a href={featuredBlog.path}>
              <ReadMore />
            </a>
          </Flex>
        </Box>
        <Box p={10}>
          <Img fixed={featuredBlog.featuredImage.childImageSharp.fixed}></Img>
        </Box>
      </Flex>
    </StyledFeaturedArticle>
  )
}

const BlogGrid = data => {
  console.log("blog", data)
  return (
    <Grid pt={100} ml={130} mr={100}>
      {Object.values(data.data.allMarkdownRemark.nodes).map((e, i) => {
        console.log("e", e)
        return (
          <Flex key={i} flexDirection="column" px={[0, 1]} pb={[50, 10]}>
            <a href={e.frontmatter.path} style={{ textDecoration: "none" }}>
              <Box>
                <Img
                  style={{ width: "100%", height: 200 }}
                  fixed={e.frontmatter.featuredImage.childImageSharp.fixed}
                />
                <Desc>{e.frontmatter.title}</Desc>
                <Date>{e.frontmatter.date}</Date>
              </Box>
            </a>
          </Flex>
        )
      })}
    </Grid>
  )
}

const BlogList = ({ data }) => {
  console.log(data.allMarkdownRemark.nodes[0].frontmatter.title)
  return (
    <>
      <Header />
      <FeaturedArticle data={data} />
      <BlogGrid data={data} />
      <Footer />
    </>
  )
}
export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: id }) {
      nodes {
        frontmatter {
          title
          path
          isFeatured
          featuredImage {
            childImageSharp {
              fixed(width: 500) {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      }
    }
  }
`
export default BlogList
