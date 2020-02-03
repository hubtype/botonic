import React, { useState } from 'react'
import Layout from '../components/layout'
import AppsImage from '../images/bg-apps.svg'
import PerspectiveCodeHighlighter from '../components/common/PerspectiveCodeHighlighter'
import BotDemo from '../components/common/BotDemo'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
`
const InnerLeft = styled.div`
  display: flex;
  width: 50%;
  justify-content: flex-end;
  padding: 32px;
`

const InnerPerspective = styled.div`
  display: flex;
  width: 50%;
  perspective: 539px;
  z-index: -2;
  padding: 32px;
`

const IndexPage = () => {
  const [userInput, setUserInput] = useState('none')
  const codeString = `render() {
    return (
      <>
        <Text>Welcome to Botonic! =)</Text>
        <Text>
          ${userInput}
          <Reply payload='a'>A</Reply>
          <Reply payload='b'>B</Reply>
        </Text>
      </>
    )
  }
  render() {
    return (
      <>
        <Text>Welcome to Botonic! =)</Text>
        <Text>
          ${userInput}
          <Reply payload='a'>A</Reply>
          <Reply payload='b'>B</Reply>
        </Text>
      </>
    )
  }`

  const handleCodeToShow = message => setUserInput(message)

  return (
    <Layout>
      <Container>
        <InnerLeft>
          <div>
            <BotDemo onMessageSent={handleCodeToShow} />
          </div>
        </InnerLeft>
        <InnerPerspective>
          <PerspectiveCodeHighlighter codeString={codeString} />
        </InnerPerspective>
        <AppsImage
          style={{ position: 'absolute', width: '100%', zIndex: -1 }}
        />
      </Container>
    </Layout>
  )
}

export default IndexPage
