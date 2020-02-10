import parser from 'html-react-parser'
import { ReactElement, default as React } from 'react'
import ReactDOMServer from 'react-dom/server'
import decode from 'unescape'
import { RequestContext } from '../../src'
import { requestContext } from '../../src/contexts'

/**
 *
 * @param node { ReactNode}
 * @return {string}
 */
export function render(node) {
  return decode(ReactDOMServer.renderToStaticMarkup(sut))
}

/**
 *
 * @param html {string}
 * @return {ReactElement}
 */
export function parseReactElement(html) {
  let parsed = parser(html)
  if (typeof parsed == 'string') {
    fail('Returned html is not parsable: \n' + html)
  } else if (parsed instanceof Array) {
    parsed = React.createElement(React.Fragment, null, ...parsed)
  }
  return parsed
}


/**
 *
 * @param node {React.ReactNode}
 */
export function withContext(node, context) {
  //context = requestContext(context)
  // const kk = React.useReducer(requestReducer)
  // const kk =React.useContext(RequestContext)
  // const cons = RequestContext.Consumer
  // const val = RequestContext.Consumer.getValue
  return <RequestContext.Provider value={context}>
    {node}
  </RequestContext.Provider>
}
