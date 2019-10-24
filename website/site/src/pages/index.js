import React, { useState } from "react"
import { Link } from "gatsby"
import { WebchatApp } from "@botonic/react"
import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import { useStaticQuery, graphql } from "gatsby"
import AppsImage from "../images/bg-apps.svg"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Flex } from "rebass"

let app = new WebchatApp({
  appId: "959e282d-3e03-4469-bec9-0d42d4d0662e",
  theme: {
    style: {
      position: "relative",
      background: "#43495F"
    },
    botMessageStyle: {
      fontFamily: "Noto Sans JP",
      background: '#FFFFFF',
      lineHeight: '26px',
      fontSize: "18 spx",
      borderRadius: "26px",
      border: "1px solid white",
    },
    userMessageStyle: {
      fontFamily: "Noto Sans JP",
      background: 'rgb(0, 153, 255)',
      border: "1px solid rgb(0, 153, 255)",
      lineHeight: '26px',
      fontSize: "18 spx",
      borderRadius: "26px"
    },
    textAreaStyle: {
      lineHeight: '26px',
      borderRadius: "26px"
    },
    customHeader: () => <div></div>,
    triggerButtonImage: null,
  },
  persistentMenu: null,
  emojiPicker: true,
  defaultDelay: 1,
  defaultTyping: 1,
  onInit: () => {
    app.open()
    app.addBotMessage({ type: "text", data: "Welcome to Botonic!" })
    app.addUserMessage({ type: "text", data: "start" })
  },
})

const IndexPage = () => {
  const [userInput, setUserInput] = useState("none")
  const data = useStaticQuery(graphql`
    query {
      backgroundImage: file(relativePath: { eq: "bg-apps.png" }) {
        childImageSharp {
          fluid(quality: 100, maxWidth: 1920) {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
  `)
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
  }`;
  return (
    <Layout>
      <Flex minHeight="646px">
        <Flex p={4} width={1 / 2} justifyContent='flex-end'>
          <div>
          {app.getComponent({
            onMessage: (app, message) => {
              console.log(message)
              setUserInput(message.message.data)
            },
          })}
          </div>
        </Flex>
        <Flex p={4} width={1 / 2} style={{perspective: '539px', zIndex: -2}}>
          <div style={{ transform: 'rotate3d(0, 1, 0, -10deg)', minWidth: 538, minHeight: 400, position: "absolute", background:'linear-gradient(180deg, #4D546C 0%, rgba(77, 84, 108, 0) 100%)' }} >
          <SyntaxHighlighter language="jsx" style={tomorrow} customStyle={{background: 'transparent', fontFamily: 'Palinquin', fontSize: '13px'}}>
            {codeString}
          </SyntaxHighlighter>
          </div>
        </Flex>
        <AppsImage style={{ position: "absolute", width: "100%", zIndex: -1 }} />
      </Flex>
      
      {/* <BackgroundImage
        style= {{
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'}}
        Tag="section"
        fluid={data.backgroundImage.childImageSharp.fluid}
        backgroundColor={`#464D65`}
      > */}
      {/* <SEO title="Home" />
        <div className="hello"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div style={{ flex: "1 1 auto", width: "50%" }}> */}
      
      {/* </div>
          <div style={{ flex: "1 1 auto", width: "50%", textAlign: "center" }}>
            User Type: {userInput}
          </div>
        </div> */}
      {/* </BackgroundImage> */}
    </Layout>
  )
}

export default IndexPage
