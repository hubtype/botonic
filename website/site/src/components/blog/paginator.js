import React from 'react'
import styled from 'styled-components'
import ArrowLeft from '../../images/arrowLeft.svg'
import ArrowRight from '../../images/arrowRight.svg'

const StyledPages = styled.a`
  font-family: Heebo;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  /* identical to box height */
  text-decoration: none;
  color: #99a0b6;
  padding: 10px;
`
const LeftArrow = data => {
  if (!data.isFirst) {
    if (data.prevPage == '/') {
      return (
        <a href='/blog'>
          <ArrowLeft style={{ marginTop: 15, marginRight: 5 }} />
        </a>
      )
    } else {
      return (
        <a href={`/blog/page/${data.prevPage} `}>
          <ArrowLeft style={{ marginTop: 15, marginRight: 5 }} />
        </a>
      )
    }
  } else {
    return null
  }
}

const Paginator = pageContext => {
  let pageData = pageContext.data
  const isFirst = pageData.currentPage === 1
  const isLast = pageData.currentPage === pageData.numPages
  const prevPage =
    pageData.currentPage - 1 === 1
      ? '/'
      : (pageContext.currentPage - 1).toString()
  const nextPage = (pageData.currentPage + 1).toString()

  let pages = []
  if (pageData.numPages != 1) {
    for (let i = 1; i <= pageData.numPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
  }
  return (
    <>
      <LeftArrow
        isFirst={isFirst}
        prevPage={prevPage}
        style={{ textDecoration: 'none' }}
      />
      {Object.values(pages).map((e, i) => {
        if (e == 1) {
          return (
            <StyledPages key={i} href='/blog'>
              {e}
            </StyledPages>
          )
        } else {
          return (
            <StyledPages key={i} href={`blog/page/${e}`}>
              {e}
            </StyledPages>
          )
        }
      })}
      {!isLast && (
        <a href={`/blog/page/${nextPage} `}>
          <ArrowRight style={{ marginTop: 15, marginLeft: 5 }} />
        </a>
      )}
    </>
  )
}

export default Paginator
