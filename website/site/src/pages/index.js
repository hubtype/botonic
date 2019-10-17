import React, { useState } from "react"
import { Link } from "gatsby"
import { WebchatApp } from "@botonic/react"
import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

let app = new WebchatApp({
  appId: "959e282d-3e03-4469-bec9-0d42d4d0662e",
  theme: {
    style: {
      position: "relative",
      right: 0,
      bottom: 0,
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
    //app.addBotMessage({ type: "text", data: "Welcome to Botonic!" })
    app.addUserMessage({ type: "text", data: "start" })
  },
})

const BotonicCode = {
  start: "<Text>",
}

const IndexPage = () => {
  const [userInput, setUserInput] = useState("none")
  return (
    <Layout>
      <SEO title="Home" />
      <h1>Botonic</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ flex: "1 1 auto", width: "50%" }}>
          {app.getComponent({
            onMessage: (app, message) => {
              console.log(message)
              setUserInput(message.message.data)
            },
          })}
        </div>
        <div style={{ flex: "1 1 auto", width: "50%", textAlign: "center" }}>
          User Type: {userInput}
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
