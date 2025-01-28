import { WebviewRequestContext } from '@botonic/react'
import pako from 'pako'
import { useContext } from 'react'

import { BotSession } from '../../../../server/types'

export function useWebviewRequestContext() {
  const requestContext = useContext(WebviewRequestContext)
  const session = requestContext.session as BotSession
  if (typeof session.user.extra_data === 'string') {
    const decompressedExtraDataString = pako.ungzip(
      Uint8Array.from(atob(session.user.extra_data as string), c =>
        c.charCodeAt(0)
      ),
      { to: 'string' }
    )
    session.user.extra_data = JSON.parse(decompressedExtraDataString)
  }
  return { ...requestContext, session }
}
