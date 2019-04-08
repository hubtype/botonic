export default class BotonicPluginContentful {

    constructor(options) {
        this.options = options
    }
  
    async pre({ input, session, lastRoutePath }) {
        return { input, session, lastRoutePath }
    }
  
    async post({ input, session, lastRoutePath, response }) {
        return { input, session, lastRoutePath, response }
    }
}