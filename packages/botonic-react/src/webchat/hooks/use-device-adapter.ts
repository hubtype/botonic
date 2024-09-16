import { useEffect, useState } from 'react'

import { DeviceAdapter } from '../devices/device-adapter'

export function useDeviceAdapter(host: HTMLElement, isWebchatOpen: boolean) {
  const [deviceAdapter] = useState(new DeviceAdapter())

  useEffect(() => {
    if (host && isWebchatOpen) {
      deviceAdapter.init(host)
    }
  }, [host, isWebchatOpen, deviceAdapter])

  return { deviceAdapter }
}
