import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from '@rebass/grid'
import ReadMore from '../../images/read_more.svg'
import Img from 'gatsby-image'

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
const FeaturedArticle = data => {
  let article = data.data.frontmatter
  return (
    <StyledFeaturedArticle>
      <Flex mx={100} py={50}>
        <Box width={1 / 2} p={40} flexDirection='column'>
          <StyledFeatured>FEATURED ARTICLE</StyledFeatured>
          <StyledFeaturedTitle>{article.title}</StyledFeaturedTitle>
          <Flex>
            <a href={article.path}>
              <ReadMore />
            </a>
          </Flex>
        </Box>
        <Box p={10}>
          <Img
            style={{ minWidth: 500, minHeight: 300 }}
            fixed={article.featuredImage.childImageSharp.fixed}
          ></Img>
        </Box>
      </Flex>
    </StyledFeaturedArticle>
  )
}

export default FeaturedArticle
