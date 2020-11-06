import { getProperty } from '../util/objects'

export function warnDeprecated(legacyCode, newCode, extraInfo = undefined) {
  console.warn(
    `${
      extraInfo ? extraInfo : ''
    } '${legacyCode}' is deprecated. Use '${newCode}' instead.`
  )
}

export function warnDeprecatedProps(props, extraInfo) {
  const legacyNewProps = [
    { legacy: 'enableTimestamps', new: 'enabletimestamps' },
    { legacy: 'imageStyle', new: 'imagestyle' },
  ]
  legacyNewProps.forEach(p => {
    if (getProperty(props, p.legacy) !== undefined)
      warnDeprecated(p.legacy, p.new, extraInfo)
  })
}
