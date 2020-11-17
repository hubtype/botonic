import BrowserOnly from '@docusaurus/BrowserOnly'
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import Button from '@material-ui/core/Button'
import React, { useEffect, useState } from 'react'

import { ALL_PATH_NAMES } from '../../constants'

export const WasPageUseful = () => {
  return (
    <BrowserOnly
      fallback={<div>Was this article useful?</div>}
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
              <h4>Was this article useful?</h4>
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
