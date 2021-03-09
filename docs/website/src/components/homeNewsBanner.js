/* eslint-disable import/no-unresolved */
/* eslint-disable node/no-missing-import */
import React from 'react'

function HomeNewsBanner({
  highlight = 'NEW',
  color = 'purple',
  link,
  className,
  children,
}) {
  return (
    <div className={className}>
      <a href={link}>
        <p
          className={`inline-block leading-5 mb-0 rounded-full bg-${color}-200 p-1 shadow-inner`}
        >
          <span
            className={`rounded-full bg-${color}-600 text-${color}-100 px-2 py-1 text-xs`}
          >
            {highlight}
          </span>
          <span className='inline-block px-4 leading-5 text-sm'>
            {children}
          </span>
        </p>
      </a>
    </div>
  )
}

export default HomeNewsBanner
