const React = require('react')
const ReactDOMServer = require('react-dom/server')

import { default as i18n } from '@botonic/core/lib/i18n'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}

export async function renderReactAction(req, action) {
	let props = {}
	if(action.botonicInit) {
       props = await action.botonicInit({req})
    }

    let component = React.createElement(action, (props && typeof(props)==='object') ? Object.assign(props, req) : req)
    return ReactDOMServer.renderToStaticMarkup(component)
}

export function setLocale(req: any, locale: string) {
    req.context.__locale = locale
    i18n.setLocale(locale)
}
export { BotonicWebview } from './webview'
export { MessageTemplate } from './messageTemplate'
export { ShareButton } from './shareButton'
