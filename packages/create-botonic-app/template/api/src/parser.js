export function htmlToBotonicMessage(html) {
  // XML parsing library (https://www.npmjs.com/package/xml-js)
  // convert XML nodes to JSON messages
  // inject absolute URL to webview buttons
  // <button webview='/my-webview'>Open webview</button>
  // <button webview='https://S3bucket/my-webview'>Open webview</button>
  const regexContent = /<message[^>]*>([^<]*)<\/message[^>]*>/g
  let messages = []
  let m
  do {
    m = regexContent.exec(html)
    if (m) {
      messages.push({ type: 'text', data: m[1] })
    }
  } while (m)
  return messages
}
