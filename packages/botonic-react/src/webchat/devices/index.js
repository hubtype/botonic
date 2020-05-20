export const DEVICES = Object.freeze({
  MOBILE: {
    IPHONE: 'iPhone',
    ANDROID: 'Android',
    WEBOS: 'webOS',
    BLACKBERRY: 'BlackBerry',
    WINDOWS_PHONE: 'Windows Phone',
  },
})

export const isDevice = deviceName => {
  // https://stackoverflow.com/questions/19877924/what-is-the-list-of-possible-values-for-navigator-platform-as-of-today
  return (
    !!navigator.platform &&
    navigator.platform.toLowerCase().includes(deviceName.toLowerCase())
  )
}

export const isMobileDevice = () => {
  return Object.values(DEVICES.MOBILE).some(deviceName => isDevice(deviceName))
}
