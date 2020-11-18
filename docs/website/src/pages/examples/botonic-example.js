/* eslint-disable import/no-unresolved */
// eslint-disable-next-line node/no-missing-import
import Head from '@docusaurus/Head'
import React from 'react'

import Analytics from '../../components/analytics'
import { isBrowser, removejscssfile } from '../../util/dom'

const BotonicExample = ({ title, rootId, runtimeOptions, src }) => {
  if (isBrowser) {
    removejscssfile('styles.css', 'css') // Dev
    removejscssfile('styles.9c057c15.css', 'css') // Prod
    window.onload = () => {
      setTimeout(() => {
        // eslint-disable-next-line no-undef
        Botonic &&
          // eslint-disable-next-line no-undef
          Botonic.render(document.getElementById(rootId), runtimeOptions)
      }, 500)
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
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <a
          style={{
            textDecoration: 'none',
            color: 'black',
          }}
          href='/examples'
        >
          Go back to Examples
        </a>
      </div>
      <div id={rootId}></div>
    </>
  )
}

export default BotonicExample
