/* eslint-disable import/no-unresolved */
/* eslint-disable node/no-missing-import */
import Head from '@docusaurus/Head'
import React from 'react'

import nluImage from '../../../static/img/examples/nlu.png'
import bookingImage from '../../../static/img/examples/reservation.png'
import telcoImage from '../../../static/img/examples/telco.png'
import Analytics from '../../components/analytics'
import { ExamplesSection } from '../../components/examples'
import HomeHeader from '../../components/homeHeader'
import PageIllustration from '../../components/pageIllustration'

const cards = [
  {
    project: {
      title: 'Booking Platform',
      description:
        'Use custom messages and webviews in order to book a reservation in a hotel',
      asset: bookingImage,
    },
    links: {
      github:
        'https://github.com/hubtype/botonic-examples/tree/master/booking-platform',
      example: 'https://botonic-example-booking-platform.netlify.app/',
    },
  },
  {
    project: {
      title: 'NLU Assistant',
      description:
        'Train your own NLU model in order to understand your user intents',
      asset: nluImage,
    },
    links: {
      github:
        'https://github.com/hubtype/botonic-examples/tree/master/nlu-assistant',
      example: '/examples/nlu-assistant',
    },
  },
  {
    project: {
      title: 'Telco Offers',
      description:
        'Flow to acquire an Internet or a cell phone rate using buttons and replies',
      asset: telcoImage,
    },
    links: {
      github:
        'https://github.com/hubtype/botonic-examples/tree/master/telco-offers',
      example: 'https://botonic-example-telco-offers.netlify.app/',
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
