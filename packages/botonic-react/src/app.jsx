import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

import { isBrowser, isNode, getNLU } from '@botonic/core'
import { Router, getString } from '@botonic/core'
import { Webchat } from './webchat'
import { RequestContext } from './contexts'

export class App {
    constructor({ routes, locales, integrations }) {
        this.rootElement = null
        this.routes = routes
        this.locales = locales
        this.integrations = integrations
        this.router = new Router(this.routes)
    }

    getString(stringID, session) {
        return getString(this.locales, session.__locale, stringID)
    }

    setLocale(locale, session) {
        session.__locale = locale
    }

    webchat() {
        return <Webchat botonicApp={this} />
    }

    render(dest) {
        ReactDOM.render(this.webchat(), dest)
    }

    async input({ input, session, lastRoutePath }) {
        session = session || {}
        if (!session.__locale) session.__locale = 'en'
        if (this.integrations && input.type == 'text') {
            try {
                let nlu = await getNLU(input, this.integrations)
                Object.assign(input, nlu)
            } catch (e) {}
        }
        let output = this.router.processInput(input, session, lastRoutePath)
        let Action = output.action
        let RetryAction = output.retryAction
        let DefaultAction = output.defaultAction
        let props = {}
        let req = {
            input,
            session,
            params: output.params,
            lastRoutePath
        }
        if (Action.botonicInit) {
            props = await Action.botonicInit(req)
        }
        let retryProps = {}
        if (RetryAction && RetryAction.botonicInit) {
            retryProps = await RetryAction.botonicInit(req)
        }
        let defaultProps = {}
        if (DefaultAction && DefaultAction.botonicInit) {
            defaultProps = await DefaultAction.botonicInit(req)
        }
        let request = {
            getString: stringId => this.getString(stringId, session),
            setLocale: locale => this.setLocale(locale, session),
            session: session || {},
            params: output.params || {},
            input: input
        }

        let component = (
            <RequestContext.Provider value={request}>
                <Action {...props} />
                {RetryAction && <RetryAction {...retryProps} />}
                {DefaultAction && <DefaultAction {...defaultProps} />}
            </RequestContext.Provider>
        )
        let response = null
        if (isBrowser()) response = component
        else response = ReactDOMServer.renderToStaticMarkup(component)
        return { response, session, lastRoutePath: output.lastRoutePath }
    }
}
