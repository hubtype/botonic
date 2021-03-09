/* eslint-disable import/no-unresolved */
/* eslint-disable node/no-missing-import */
import AnnouncementBar from '@theme/AnnouncementBar'
import LayoutHead from '@theme/LayoutHead'
import LayoutProviders from '@theme/LayoutProviders'
import React from 'react'
import { InlineWidget } from 'react-calendly'

import Analytics from '../components/analytics'
import HomeHeader from '../components/homeHeader'

function Home() {
  return (
    <LayoutProviders>
      <LayoutHead title='Office Hours | Botonic' />
      <Analytics />
      <AnnouncementBar />
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
            <h1>Botonic Office Hours</h1>
            <p>
              Schedule a <strong>free</strong> online session with a Botonic
              expert:
            </p>
            <InlineWidget url='https://calendly.com/eric-hubtype/botonic-office-hours' />
          </div>
        </main>
      </div>
    </LayoutProviders>
  )
}

export default Home
