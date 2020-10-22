import React from 'react'
import Head from '@docusaurus/Head'
import Analytics from '../components/analytics'
import HomeHeader from '../components/homeHeader'
import PageIllustration from '../components/pageIllustration'
import HomeHero from '../components/homeHero'
import MessagingAppsLeft from '../../static/img/MessagingAppsLeft.svg'
import MessagingAppsRight from '../../static/img/MessagingAppsRight.svg'

function Home() {
  return (
    <>
      <Head>
        <title>
          An open-source framework to build chatbots and conversational apps |
          Botonic
        </title>
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
            <MessagingAppsLeft className='absolute top-20 left-0 opacity-25 lg:opacity-75' />
            <MessagingAppsRight className='absolute top-50 right-0 invisible lg:visible opacity-75' />
          </div>

          {/*  Page sections */}
          <HomeHero />
        </main>
      </div>
    </>
  )
}

export default Home
