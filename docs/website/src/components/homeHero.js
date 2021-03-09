import React from 'react'

import HomeNewsBanner from './homeNewsBanner'

function HomeHero() {
  return (
    <section>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 relative'>
        {/* Hero content */}
        <div className='relative pt-24 pb-10 md:pt-32 md:pb-16'>
          {/* Section header */}
          <HomeNewsBanner
            className='max-w-3xl mx-auto text-center pb-8 md:pb-12'
            link='/blog/2021/03/10/introducing-botonic-office-hours/'
          >
            Friday Office Hours
          </HomeNewsBanner>
          <div className='max-w-3xl mx-auto text-center pb-12 md:pb-16'>
            <h1
              className='text-5xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4'
              data-aos='zoom-y-out'
            >
              The React Framework to Build{' '}
              <span
                style={{ letterSpacing: '-0.02em' }}
                className='bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400'
              >
                Conversational Apps
              </span>
            </h1>
            <div className='max-w-3xl mx-auto'>
              <p
                className='text-xl text-gray-600 mb-8 mx-auto max-w-2xl'
                data-aos='zoom-y-out'
                data-aos-delay='150'
              >
                Building modern applications on top of messaging apps like
                Whatsapp or Messenger is much more than creating simple
                text-based chatbots.
                <br />
                Botonic is a <b>full-stack serverless</b> framework that
                combines the power of <b>React</b> and <b>Tensorflow.js</b> to
                create amazing experiences at the intersection of text and
                graphical interfaces.
              </p>
              <div
                className='max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center'
                data-aos='zoom-y-out'
                data-aos-delay='300'
              >
                <div>
                  <a
                    className='btn text-white hover:text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-48 sm:mb-0 hover:no-underline'
                    href='/docs/getting-started'
                  >
                    Start building
                  </a>
                </div>
                {/*<div>
                  <a
                    className='btn text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto sm:ml-4'
                    href='#0'
                  >
                    Learn more
                  </a>
                </div>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHero
