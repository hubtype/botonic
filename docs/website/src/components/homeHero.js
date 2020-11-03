import React from 'react'

function HomeHero() {
  return (
    <section>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 relative'>
        {/* Hero content */}
        <div className='relative pt-32 pb-10 md:pt-40 md:pb-16'>
          {/* Section header */}
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
                className='text-xl text-gray-600 mb-8'
                data-aos='zoom-y-out'
                data-aos-delay='150'
              >
                Botonic is an open-source, full-stack serverless framework to
                create chatbots and modern chat-based applications for the web
                and messaging apps.
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
                  <a
                    className='btn text-blue-600 visited:text-blue-600 hover:text-blue-600 bg-white hover:bg-blue-100 border-2 border-solid border-blue-600 w-full mb-4 sm:ml-8 sm:w-48 sm:mb-0 hover:no-underline'
                    href='https://github.com/hubtype/botonic'
                  >
                    GitHub
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
