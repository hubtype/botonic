export function getWebpackEnvVar(
  webpackEnvVar: string | false,
  name: string,
  defaultValue: string
): string {
  return (
    webpackEnvVar ||
    (typeof process !== 'undefined' && process.env[name]) ||
    defaultValue
  )
}
