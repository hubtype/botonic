import BrowserOnly from '@docusaurus/BrowserOnly'
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import Button from '@material-ui/core/Button'
import React, { useEffect, useState } from 'react'

import { ALL_PATH_NAMES } from '../../constants'

export const WasPageUseful = () => {
  return (
    <BrowserOnly
      fallback={<div>The fallback content to display on prerendering</div>}
    >
      {() => {
        const initialState = {
          disabled: false,
        }
        const [state, setState] = useState(initialState)

        const handleClick = event => {
          sendWasPageUseful(event)
          setState({ disabled: true })
        }

        const location = ExecutionEnvironment.canUseDOM
          ? window.location.href
          : null

        useEffect(() => {
          setState(initialState)
        }, [location])

        const sendWasPageUseful = wasUseful => {
          if (typeof window === 'undefined') return
          const data = {
            category: 'Was page useful?',
            label: `${location}`,
            value: wasUseful,
          }
          window.analytics.track('Was page useful?', data)
        }

        const shouldShowWasPageUseful = () => {
          const url = new URL(location)
          let pathName = url.pathname.split('/docs')[1]
          pathName = pathName.endsWith('/') ? pathName : `${pathName}/`
          return ALL_PATH_NAMES.includes(pathName)
        }
        // Don't render component in 404 not found pages
        if (!shouldShowWasPageUseful()) return null
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: 30,
              borderTop: '1px solid gray',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <h4>Was this page useful?</h4>
              <div
                style={{
                  display: 'flex',
                  width: 200,
                  justifyContent: 'space-around',
                }}
              >
                <Button
                  color='primary'
                  variant='contained'
                  disabled={state.disabled}
                  onClick={() => handleClick(true)}
                >
                  YES
                </Button>
                <Button
                  color='default'
                  variant='contained'
                  disabled={state.disabled}
                  onClick={() => handleClick(false)}
                >
                  NO
                </Button>
              </div>
            </div>
          </div>
        )
      }}
    </BrowserOnly>
  )
}
