/* eslint-disable import/no-unresolved */
// eslint-disable-next-line node/no-missing-import
import Head from '@docusaurus/Head'
import React, { useState } from 'react'

import Analytics from '../../components/analytics'
import { isBrowser, removejscssfile } from '../../util/dom'

const BotonicExample = ({ title, rootId, runtimeOptions, src }) => {
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

  return (
    <>
      <Head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <script type='text/javascript' src={src}></script>
        <title>{title}</title>
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
      <div id={rootId}></div>
    </>
  )
}

export default BotonicExample
