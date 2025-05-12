import React, { forwardRef } from 'react'

import { WebchatProps, WebchatRef } from '../index-types'
import { useWebchat } from './context/use-webchat'
import { useBotonicStorage } from './use-botonic-storage'
import { Webchat } from './webchat'

export const WebchatHooks = forwardRef<
  WebchatRef | null,
  Omit<WebchatProps, 'webchatHooks'>
>((props, ref) => {
  const { getBotonicStorage } = useBotonicStorage(
    props.storage,
    props.storageKey
  )

  const devSettings =
    getBotonicStorage()?.devSettings || props.initialDevSettings

  console.log('devSettings', {
    keepSessionOnReload: devSettings?.keepSessionOnReload,
    showSessionView: devSettings?.showSessionView,
  })

  const webchatHooks = useWebchat(
    props.theme,
    getBotonicStorage(),
    props.initialSession,
    devSettings
  )

  return <Webchat {...props} ref={ref} webchatHooks={webchatHooks} />
})

WebchatHooks.displayName = 'WebchatHooks'
