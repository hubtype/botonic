/* eslint-disable import/no-unresolved */
// eslint-disable-next-line node/no-missing-import
import Head from '@docusaurus/Head'
import React from 'react'

import Analytics from '../../components/analytics'

const BotonicExample = ({ title, rootId, runtimeOptions, src }) => {
  if (typeof window !== 'undefined') {
    const removejscssfile = (filename, filetype) => {
      const targetelement =
        filetype == 'js' ? 'script' : filetype == 'css' ? 'link' : 'none' //determine element type to create nodelist from
      const targetattr =
        filetype == 'js' ? 'src' : filetype == 'css' ? 'href' : 'none' //determine corresponding attribute to test for
      const allsuspects = document.getElementsByTagName(targetelement)
      for (let i = allsuspects.length; i >= 0; i--) {
        //search backwards within nodelist for matching elements to remove
        if (
          allsuspects[i] &&
          allsuspects[i].getAttribute(targetattr) != null &&
          allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1
        )
          allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
      }
    }
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
