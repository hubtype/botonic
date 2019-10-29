import React, { useState } from 'react'
import { WebchatApp } from '@botonic/react'
import Layout from '../components/layout'
import AppsImage from '../images/bg-apps.svg'
import PerspectiveCodeHighlighter from '../components/common/PerspectiveCodeHighlighter'
import BotDemo from '../components/common/BotDemo'
import styled from 'styled-components'

let app = new WebchatApp({
  appId: '959e282d-3e03-4469-bec9-0d42d4d0662e',
  theme: {
    style: {
      position: 'relative',
      background: '#43495F'
    },
    botMessageStyle: {
      fontFamily: 'Noto Sans JP',
      background: '#FFFFFF',
      lineHeight: '26px',
      fontSize: '18 spx',
      borderRadius: '26px',
      border: '1px solid white'
    },
    userMessageStyle: {
      fontFamily: 'Noto Sans JP',
      background: 'rgb(0, 153, 255)',
      border: '1px solid rgb(0, 153, 255)',
      lineHeight: '26px',
      fontSize: '18 spx',
      borderRadius: '26px'
    },
    textAreaStyle: {
      lineHeight: '26px',
      borderRadius: '26px'
    },
    customHeader: () => <div></div>,
    triggerButtonImage: null
  },
  persistentMenu: null,
  emojiPicker: true,
  defaultDelay: 1,
  defaultTyping: 1,
  onInit: () => {
    app.open()
    app.addBotMessage({ type: 'text', data: 'Welcome to Botonic!' })
    app.addUserMessage({ type: 'text', data: 'start' })
  }
})

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
