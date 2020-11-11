/* eslint-disable import/no-unresolved */
/* eslint-disable node/no-missing-import */
import Head from '@docusaurus/Head'
import React from 'react'

import Analytics from '../../components/analytics'
import { ExamplesSection } from '../../components/examples'
import HomeHeader from '../../components/homeHeader'
import PageIllustration from '../../components/pageIllustration'

const cards = [
  {
    project: {
      title: 'Title',
      description: 'Description of this example',
    },
    links: {
      example: 'link to example',
      github: 'link to github',
    },
  },
  {
    project: {
      title: 'Title',
      description: 'Description of this example',
    },
    links: {
      example: 'link to example',
      github: 'link to github',
    },
  },
  {
    project: {
      title: 'Title',
      description: 'Description of this example',
    },
    links: {
      example: 'link to example',
      github: 'link to github',
    },
  },
]

const Examples = () => {
  return (
    <>
      <Head>
        <title>Botonic Examples</title>
      </Head>
      <Analytics />
      <div className='flex flex-col min-h-screen overflow-hidden'>
        {/*  Site header */}
        <HomeHeader />
        {/*  Page content */}
        <main className='flex-grow'>
          {/*  Page illustration */}
          <div
            className='relative max-w-6xl mx-auto h-0 pointer-events-none'
            aria-hidden='true'
          >
            <PageIllustration />
          </div>

          <ExamplesSection cards={cards} />
        </main>
      </div>
    </>
  )
}

export default Examples
