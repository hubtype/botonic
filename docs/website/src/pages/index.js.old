/* eslint-disable import/no-unresolved */
/* eslint-disable node/no-missing-import */
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import classnames from 'classnames'
import React, { useState } from 'react'

import BotDemo from '../components/botDemo'
import PerspectiveCodeHighlighter from '../components/perspectiveCodeHighlighter'
import styles from './styles.module.css'

function Home() {
  // TODO: Add new Botonic docs index.js showcase/playground
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  const [userInput, setUserInput] = useState()
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
  }`
  const handleCodeToShow = message => setUserInput(message)
  return (
    <div>
      <BotDemo onMessageSent={handleCodeToShow} />
      <PerspectiveCodeHighlighter>{codeString}</PerspectiveCodeHighlighter>
    </div>
  )
}

export default Home
