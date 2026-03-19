/* eslint-disable import/no-unresolved */
/* eslint-disable node/no-missing-import */
import Head from '@docusaurus/Head'
import React from 'react'

function Analytics() {
  return (
    <Head>
      <script
        src={`https://www.googleoptimize.com/optimize.js?id=${process.env.GOOGLE_OPTIMIZE_ID}`}
      ></script>
    </Head>
  )
}

export default Analytics
