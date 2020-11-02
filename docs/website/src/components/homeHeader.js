import React, { useState, useRef, useEffect } from 'react'
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import BotonicLogo from '../../static/img/botonic-logo.png'

function HeaderLink(props) {
  return (
    <Link
      className='text-gray-600 hover:text-gray-800 px-4 py-2 flex items-center transition duration-150 ease-in-out'
      {...props}
    />
  )
}

function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const mobileNav = useRef(null)

  // close the mobile menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!mobileNavOpen || mobileNav.current.contains(target)) return
      setMobileNavOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // close the mobile menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!mobileNavOpen || keyCode !== 27) return
      setMobileNavOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  return (
    <header className='absolute w-full z-30 bg-gradient-to-b from-white via-white'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6'>
        <div className='grid grid-cols-3 place-items-stretch place-content-evenly h-20'>
          {/* Empty column to center title */}
          <div className='invisible md:visible'></div>
          {/* Site branding */}
          <div className='grid grid-cols-1 justify-center content-center items-center place-content-center place-items-center'>
            {/* Logo */}
            <Link
              to={useBaseUrl('')}
              className='flex items-center hover:no-underline'
              aria-label='Botonic'
            >
              <img
                src={BotonicLogo}
                className='w-8 h-8 mr-2 inline-block'
                alt='Botonic Logo'
              />
              <span className='font-bold text-gray-800'>Botonic</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className='invisible md:visible'>
            {/* Desktop menu links */}
            <ul className='flex justify-end flex-wrap items-center'>
              <li className='list-none'>
                <HeaderLink to={useBaseUrl('/docs/welcome')}>Docs</HeaderLink>
              </li>
              <li className='list-none'>
                <HeaderLink to='https://github.com/hubtype/botonic'>
                  GitHub
                </HeaderLink>
              </li>
              <li className='list-none'>
                <HeaderLink to='https://slack.botonic.io/'>Slack</HeaderLink>
              </li>
            </ul>
          </nav>

          {/* Mobile menu */}
          <div className='md:hidden absolute right-20 top-20'>
            {/* Hamburger button */}
            <button
              className={`hamburger ${mobileNavOpen && 'active'}`}
              aria-controls='mobile-nav'
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              <span className='sr-only'>Menu</span>
              <svg
                className='w-6 h-6 fill-current text-gray-800 hover:text-gray-900 transition duration-150 ease-in-out'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect y='4' width='24' height='2' rx='1' />
                <rect y='11' width='24' height='2' rx='1' />
                <rect y='18' width='24' height='2' rx='1' />
              </svg>
            </button>

            {/*Mobile navigation */}
            <nav
              id='mobile-nav'
              ref={mobileNav}
              className='absolute top-full z-20 right-0 overflow-hidden w-40 px-4 sm:px-6 transition-all duration-300 ease-in-out'
              style={
                mobileNavOpen
                  ? { maxHeight: mobileNav.current.scrollHeight, opacity: 1 }
                  : { maxHeight: 0, opacity: 0.8 }
              }
            >
              <ul className='bg-gray-800 px-4 py-2 w-40 list-none'>
                <li>
                  <Link
                    to={useBaseUrl('/docs/welcome')}
                    className='flex text-gray-300 hover:text-gray-200 py-2'
                  >
                    Docs
                  </Link>
                </li>
                <li>
                  <Link
                    to='https://github.com/hubtype/botonic'
                    className='flex text-gray-300 hover:text-gray-200 py-2'
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    to='https://slack.botonic.io/'
                    className='flex text-gray-300 hover:text-gray-200 py-2'
                  >
                    Slack
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
