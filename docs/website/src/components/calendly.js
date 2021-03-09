/* eslint-disable import/no-unresolved */
/* eslint-disable node/no-missing-import */
import React from 'react'

const Calendly = () => (
  <>
    <div
      className='calendly-inline-widget'
      dataUrl='https://calendly.com/eric-hubtype/botonic-office-hours'
      style={{ minWidth: 320, height: 630 }}
    ></div>
    <script
      type='text/javascript'
      src='https://assets.calendly.com/assets/external/widget.js'
      async
    ></script>
  </>
)

export default Calendly
