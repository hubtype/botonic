/* eslint-disable import/no-unresolved */
/* eslint-disable node/no-missing-import */
import React from 'react'
import Head from '@docusaurus/Head'

function Analytics() {
  const segmentSnippet = () => {
    return `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var t=analytics.methods[e];analytics[t]=analytics.factory(t)}analytics.load=function(e,t){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+e+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=t};analytics.SNIPPET_VERSION="4.1.0";analytics.load("${process.env.SEGMENT_DOCS_API_KEY}");analytics.page();}}();`
  }
  return (
    <Head>
      <script type='text/javascript'>{segmentSnippet()}</script>
      <script
        src={`https://www.googleoptimize.com/optimize.js?id=${process.env.GOOGLE_OPTIMIZE_ID}`}
      ></script>
    </Head>
  )
}

export default Analytics
