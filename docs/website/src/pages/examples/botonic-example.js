/* eslint-disable import/no-unresolved */
// eslint-disable-next-line node/no-missing-import
import Head from '@docusaurus/Head'
import axios from 'axios'
import MarkdownIt from 'markdown-it'
import React, { useEffect, useState } from 'react'

import Analytics from '../../components/analytics'
import { isBrowser, removejscssfile } from '../../util/dom'

const removeTableOfContents = markdownString => {
  // Remove ToC as after passing markdown to html it doesn't work
  return markdownString.replace(
    /\*\*What's in this document\?\*\*(.*)## How to use this example/gms,
    '## How to use this example'
  )
}

const markdownRenderer = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

const BotonicExample = ({
  title,
  rootId,
  runtimeOptions,
  src,
  markdownSrc,
}) => {
  const [loading, setLoading] = useState(true)
  const errorMsg =
    'Error loading bot script. Please refresh the page and try again.'
  const [error, setError] = useState(false)
  if (isBrowser) {
    removejscssfile('styles.css', 'css') // Dev
    removejscssfile('styles.9c057c15.css', 'css') // Prod
    window.onload = () => {
      setTimeout(() => {
        try {
          // eslint-disable-next-line no-undef
          Botonic &&
            // eslint-disable-next-line no-undef
            Botonic.render(document.getElementById(rootId), runtimeOptions)
        } catch (e) {
          setError(errorMsg)
          console.error(errorMsg)
        }
        setLoading(false)
      }, 0)
    }
  }

  const [markdown, setMarkdown] = useState(undefined)
  useEffect(() => {
    markdownSrc &&
      axios
        .get(
          `https://raw.githubusercontent.com/hubtype/botonic-examples/master/${markdownSrc}`
        )
        .then(md => setMarkdown(removeTableOfContents(md.data)))
        .catch(e => {
          console.error(e)
        })
  }, [])

  return (
    <>
      <Head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <script type='text/javascript' src={src}></script>
        <title>{title}</title>
        <link rel='stylesheet' href='/static/css/markdown.module.css'></link>
        {/* Dev sourcing from /static/css/, Prod from /css/  */}
        <link rel='stylesheet' href='/css/markdown.module.css'></link>
      </Head>
      <Analytics />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <a
          style={{
            textDecoration: 'none',
            color: 'black',
          }}
          href='/examples'
        >
          Go back to Examples
        </a>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
      </div>
      {markdown && (
        <div
          className='markdown-body'
          dangerouslySetInnerHTML={{
            __html: markdownRenderer.render(markdown),
          }}
        />
      )}
      <div id={rootId}></div>
    </>
  )
}

export default BotonicExample
