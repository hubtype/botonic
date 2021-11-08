import serverlessExpress from '@vendia/serverless-express'
import chalk from 'chalk'
import terminalLink from 'terminal-link'
import { Environments } from '..'

export function restServerFactory({ env, app }) {
  if (env === Environments.LOCAL) {
    const port = process.env.PORT
    if (port) {
      app.listen(port, () => {
        console.log(
          `${chalk.bold('Botonic REST API')} listening on port ${chalk.bold(
            port
          )}`
        )
        const localUrl = `http://localhost:${port}`
        console.log(
          `${terminalLink(localUrl, localUrl, { fallback: () => localUrl })}`
        )
      })
    }
  }
  if (env === Environments.AWS) return serverlessExpress({ app })
}
