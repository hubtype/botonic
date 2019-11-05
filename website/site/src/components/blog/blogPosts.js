import React from 'react'
import { graphql } from 'gatsby'
import { Flex } from '@rebass/grid'
import Header from '../header'
import Footer from '../footer'
import Paginator from './paginator'
import FeaturedArticle from './featuredArticle'
import BlogGrid from './blogGrid'

const BlogPosts = ({ pageContext, data }) => {
  return (
    <>
      <Header />
      <FeaturedArticle data={data.allMarkdownRemark.nodes[0]} />
      <BlogGrid data={data} />
      <Flex justifyContent='center'>
        <Paginator data={pageContext}></Paginator>
      </Flex>
      <Footer />
    </>
  )
}
export const query = graphql`
  query blogListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        frontmatter {
          title
          path
          date(formatString: "MMMM DD, YYYY")
          category
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
export default BlogPosts
