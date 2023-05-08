/* eslint-disable import/no-unresolved */
/* eslint-disable node/no-missing-import */
import React from 'react'

import ArrowIcon from '../../static/arrow-icon.svg'
import GithubIcon from '../../static/github-icon.svg'

const GithubLink = ({ link }) => (
  <a
    href={link}
    className='w-150 -ml-1 p-1 rounded-md text-left hover:bg-blue-500 hover:text-white text-gray-700 flex items-center cursor-pointer'
  >
    <span className='float-left mt-1 no-underline'>View Source</span>
    <GithubIcon
      alt='View Source'
      className='float-right mx-2 h-8 w-8 fill-current'
    />
  </a>
)

const CheckExample = ({ link }) => {
  return (
    <a
      href={link}
      target='_blank'
      className='w-150 -ml-1 p-1 rounded-md text-left hover:bg-blue-500 text-gray-700 hover:text-white flex items-center cursor-pointer'
    >
      <span className='float-left no-underline'>Visit</span>
      <ArrowIcon alt='Visit' className='float-right h-4 w-10 fill-current' />
    </a>
  )
}

const Card = ({ project, links }) => {
  return (
    <div className='my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3 mb-10'>
      <div className='group bg-white rounded-lg shadow-lg h-full'>
        <a href={links.example}>
          <img
            alt='Placeholder'
            className='block rounded-t-lg shadow-2xl'
            src={project.asset}
          />
        </a>
        <p className='text-gray-900 p-4 font-bold'>{project.title}</p>
        <p className='text-gray-700 px-4 h-10 -mt-4'>{project.description}</p>
        <div className='flex w-full justify-between px-4 text-xs x-4 border-b-2 rounded-tl-lg rounded-tr-lg p-2 clearfix md:text-sm'>
          <GithubLink link={links.github} />
          <CheckExample link={links.example} />
        </div>
      </div>
    </div>
  )
}

const CardExamples = ({ cards }) => (
  <div className='container mx-auto px-4 md:px-2'>
    <div className='flex flex-wrap -mx-1 lg:-mx-4'>
      {cards.map((c, i) => (
        <Card key={i} project={c.project} links={c.links} />
      ))}
    </div>
  </div>
)

export const ExamplesDescription = () => (
  <p
    className='text-xl text-gray-600 mb-8'
    data-aos='zoom-y-out'
    data-aos-delay='150'
  >
    See examples and live demos built with Botonic.
  </p>
)

export const ExamplesHeader = () => (
  <h1
    className='text-5xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4'
    data-aos='zoom-y-out'
  >
    Examples
  </h1>
)

export const ExamplesSection = ({ cards }) => (
  <>
    <section>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 relative'>
        <div className='relative pt-32 pb-10 md:pt-24 md:pb-16'>
          <div className='w-full text-center'>
            <ExamplesHeader />
            <ExamplesDescription />
          </div>
          <CardExamples cards={cards} />
        </div>
      </div>
    </section>
    <div id='examples-section' />
  </>
)
