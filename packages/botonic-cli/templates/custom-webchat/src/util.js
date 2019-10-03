export const scriptUrl = () => {
  var scriptBaseUrl = document
    .querySelector('script[src$="webchat.botonic.js"]')
    .getAttribute('src')
  var scriptName = scriptBaseUrl.split('/').pop()
  scriptBaseUrl = scriptBaseUrl.replace('/' + scriptName, '/')
  return scriptBaseUrl
}
export default scriptUrl
