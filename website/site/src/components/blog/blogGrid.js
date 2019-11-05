import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from '@rebass/grid'
import ReadMore from '../../images/read_more.svg'
import Img from 'gatsby-image'

const Grid = styled(Flex)`
  display: grid;
  gap: 20px 20px;
  grid-template-columns: repeat(2, 1fr);
  @media (min-width: 512px) {
    gap: 40px 40px;
    grid-template-columns: repeat(3, 1fr);
  }
`

const Category = styled.p`
  font-family: Heebo;
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  line-height: 15px;

  color: #ff4689;
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

const BlogGrid = data => {
  data.data.allMarkdownRemark.nodes.splice(0, 1) //delete de featured article from the array
  return (
    <>
      <Grid py={100} mx={130}>
        {Object.values(data.data.allMarkdownRemark.nodes).map((e, i) => {
          return (
            <Flex key={i} flexDirection='column' px={[0, 1]} pb={[50, 10]}>
              <a href={e.frontmatter.path} style={{ textDecoration: 'none' }}>
                <Box>
                  <Img
                    style={{ width: '100%', height: 200 }}
                    fixed={e.frontmatter.featuredImage.childImageSharp.fixed}
                  />
                  <Category>{e.frontmatter.category}</Category>
                  <Desc>{e.frontmatter.title}</Desc>
                  <Date>{e.frontmatter.date}</Date>
                </Box>
              </a>
            </Flex>
          )
        })}
      </Grid>
    </>
  )
}

export default BlogGrid
