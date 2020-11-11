/* eslint-disable import/no-unresolved */
/* eslint-disable node/no-missing-import */
import React, { useState } from 'react'

import ArrowIcon from '../../static/arrow-icon.svg'
import GithubIcon from '../../static/github-icon.svg'

const GithubLink = ({ link }) => (
  <a
    href={link}
    class='group-hover:text-white w-150 -ml-1 p-1 rounded-md text-left hover:bg-blue-500 text-gray-700 align-middle cursor-pointer'
  >
    <span class='float-left mt-1 no-underline'>View Source</span>
    <GithubIcon
      alt='View Source'
      class='float-right mx-2 h-8 w-8 fill-current'
    />
  </a>
)

const createRootElement = () => {
  const root = document.createElement('div')
  const id = 'root'
  root.id = id
  return { root, id }
}

const CheckExampleLink = ({ link }) => {
  const [isOpen, setIsOpen] = useState(false)
  const removeExample = () => {
    document.getElementById('root').remove()
    const { root, id } = createRootElement()
    const section = document.getElementById('examples-section')
    section.appendChild(root)
  }
  const renderExample = () => {
    const section = document.getElementById('examples-section')
    const { root, id } = createRootElement()
    section.appendChild(root)
    setTimeout(() => {
      // eslint-disable-next-line no-undef
      Botonic.render(document.getElementById(id), {
        // TODO: Pass app id as props for every example
        appId: 'a09694a1-b734-4dd4-bb35-1163004a9ba1',
        onClose: () => {
          setIsOpen(close)
          removeExample()
        },
      })
      //eslint-disable-next-line no-undef
      Botonic.open()
    }, 0)
  }
  return (
    <a
      onClick={() => {
        if (!isOpen) {
          renderExample()
          setIsOpen(true)
        } else {
          setIsOpen(false)
          removeExample()
        }
      }}
      class='group-hover:text-white w-150 -ml-1 p-1 rounded-md text-left hover:bg-blue-500 text-gray-700 hover:text-white align-middle cursor-pointer'
    >
      <span class='float-left mt-1 no-underline'>
        {isOpen ? 'Close Example' : 'Show Example'}
      </span>
      <ArrowIcon
        alt='Check Example'
        class='float-right mt-2 h-4 w-10 fill-current'
      />
    </a>
  )
}

const Card = ({ project, links }) => (
  <div class='my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3 mb-10'>
    <div class='group bg-white hover:bg-blue-400 rounded-lg shadow-lg h-full'>
      <a href='#'>
        {/* TODO: Add corresponding pics src prop */}
        <img
          alt='Placeholder'
          class='block h-auto w-full rounded-t-lg'
          src='https://picsum.photos/600/400/?random'
        />
      </a>
      <p class='text-gray-900 group-hover:text-white p-4'>{project.title}</p>
      <p class='text-gray-700 group-hover:text-white px-4 h-10 -mt-4'>
        {project.description}
      </p>
      <div class='flex w-full justify-between px-4 text-xs x-4 border-b-2 rounded-tl-lg rounded-tr-lg p-2 clearfix md:text-sm'>
        <GithubLink link={links.github} />
        <CheckExampleLink link={links.example} />
      </div>
    </div>
  </div>
)

const CardExamples = ({ cards }) => (
  <div class='container mx-auto px-4 md:px-2'>
    <div class='flex flex-wrap -mx-1 lg:-mx-4'>
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
  <section id='examples-section'>
    <div className='max-w-6xl mx-auto px-4 sm:px-6 relative'>
      <div className='relative pt-32 pb-10 md:pt-24 md:pb-16'>
        <div className='w-full text-center'>
          <ExamplesHeader />
          <div className='max-w-3xl mx-auto'></div>
          <ExamplesDescription />
        </div>
        <CardExamples cards={cards} />
      </div>
    </div>
  </section>
)
