import { Command, flags } from '@oclif/command'
import colors from 'colors'
import concurrently from 'concurrently'
import fs from 'fs'
import kill from 'kill-port'
import path from 'path'

import { Telemetry } from '../analytics/telemetry'
import { PlaygroundService } from '../botonic-playground-service'
import { spawnNpmScript } from '../util/system'

export default class Run extends Command {
  static description = 'Serve your bot in your localhost'

  static examples = [
    `$ botonic serve\n> Project is running at http://localhost:8080/`,
  ]

  static flags = {
    preview: flags.boolean({
      char: 'p',
      description: 'Run preview Botonic 1.0 serve.',
      default: false,
    }),
  }

  static args = []

  private telemetry = new Telemetry()

  async run(): Promise<void> {
    this.telemetry.trackServe()
    const { flags } = this.parse(Run)
    if (flags.preview) {
      const apps = ['websocket', 'rest', 'webchat', 'webviews']
      const BASE_PATH = process.cwd()
      const API_REST_DIR_SRC = path.resolve(BASE_PATH, './api')
      const API_REST_PORT = 9010
      const API_WS_DIR_SRC = path.resolve(BASE_PATH, './api')
      const API_WS_PORT = 9091
      const WEBCHAT_DIR_SRC = path.resolve(BASE_PATH, './webchat')
      const WEBCHAT_PORT = 9000

      const pgs = new PlaygroundService(API_REST_PORT)
      try {
        await pgs.start()
      } catch (e) {
        console.log("Couldn't start the Playground service: ", e)
      }

      if (apps.includes('websocket')) {
        try {
          await kill(API_WS_PORT, 'tcp')
        } catch (e: any) {
          console.error(
            `Error whilst shutting down "api websocket" port (${API_WS_PORT}): ${colors.red(
              e.message
            )}`
          )
        }
      }

      if (apps.includes('rest')) {
        try {
          await kill(API_REST_PORT, 'tcp')
        } catch (e: any) {
          console.error(
            `Error whilst shutting down "api rest" port (${API_REST_PORT}): ${colors.red(
              e.message
            )}`
          )
        }
      }

      if (apps.includes('webchat')) {
        try {
          await kill(WEBCHAT_PORT, 'tcp')
        } catch (e: any) {
          console.error(
            `Error whilst shutting down "webchat" port (${WEBCHAT_PORT}): ${colors.red(
              e.message
            )}`
          )
        }
      }

      const WEBCHAT_JOB_SECONDS_DELAY = 10 // Sleep 10s to give rest and ws servers enough time to be up and running
      const jobs = {
        rest: {
          name: 'api.rest',
          command: 'yarn workspace api start:rest',
          prefixColor: 'blueBright.bgBlack',
          runWhen: () => fs.existsSync(API_REST_DIR_SRC),
        },
        websocket: {
          name: 'api.ws',
          command: 'yarn workspace api start:websocket',
          prefixColor: 'magentaBright.bgBlack',
          runWhen: () => fs.existsSync(API_WS_DIR_SRC),
        },
        webchat: {
          name: 'webchat',
          command: `sleep ${WEBCHAT_JOB_SECONDS_DELAY}; yarn workspace webchat start --env playgroundCode=${
            pgs.code || ''
          }`,
          prefixColor: 'yellowBright.bgBlack',
          runWhen: () => fs.existsSync(WEBCHAT_DIR_SRC),
        },
      }

      try {
        await concurrently(
          Object.keys(jobs)
            .map(n => apps.includes(n) && jobs[n])
            .filter(job => job && job.runWhen()),
          {
            //prefix: '{name} |',
            timestampFormat: 'HH:mm:ss',
          }
        )
      } catch (e) {
        console.log(e)
      }
      await pgs.stop()
      console.log('*****END*****')
      // TODO: Yarn will exit the process before its children, leaving the console
      // in a bad state (see: https://github.com/yarnpkg/yarn/issues/4667)
      // Possible fix by upgrading to Yarn v2
    } else {
      try {
        console.log(colors.blue('\nServing Botonic...'))
        spawnNpmScript('start')
      } catch (e) {
        console.log(e)
      }
    }
    return Promise.resolve()
  }
}
