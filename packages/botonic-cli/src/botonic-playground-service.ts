import axios from 'axios'
import localtunnel from 'localtunnel'

import { GlobalCredentialsHandler } from './analytics/credentials-handler'
import { PlaygroundSessionInfo } from './interfaces'
import { getCurrentDirectory } from './util/file-system'

const PLAYGROUND_API_HOST = 'https://api.playground.botonic.io'
/**
 * Temporary solution to allow aborting promise after a certain timeout.
 */
function withTimeout<T>(
  promise: Promise<T>,
  errorMsg: string,
  timeout = 2 * 1000
): Promise<T> {
  return new Promise(function (resolve, reject: any) {
    promise.then(resolve, reject).catch(e => console.log({ e }))
    setTimeout(reject(errorMsg), timeout)
  })
}
export class PlaygroundService {
  baseUrl: string = PLAYGROUND_API_HOST
  playgroundSessionsApi = `${this.baseUrl}/playground-sessions/`
  globalCredentialsHandler = new GlobalCredentialsHandler()
  playgroundSession: PlaygroundSessionInfo | null
  port: number
  onClose?: () => void
  tunnel: any

  constructor(port: number, onClose?: () => void) {
    this.port = port
    this.onClose = onClose
    this.tunnel = null
  }

  async start() {
    try {
      this.tunnel = await withTimeout<localtunnel.Tunnel>(
        localtunnel({ port: this.port }),
        'Tunneling service not reachable.'
      )
      this.playgroundSession = await this.newPlaygroundSession({
        anonymous_id: this.globalCredentialsHandler.getAnonymousId(),
        url: this.tunnel.url,
        app_name: getCurrentDirectory(),
      })
      this.onClose && this.tunnel.on('close', this.onClose)
    } catch (e) {
      console.error('Error creating local tunnel: ', e)
    }
  }

  async getPlaygroundSession(
    id: string
  ): Promise<PlaygroundSessionInfo | null> {
    if (!id) return null
    try {
      const resp = await axios.get(`${this.playgroundSessionsApi}${id}/`)
      return resp.data as PlaygroundSessionInfo
    } catch (e) {
      console.error('Error getting Playground Session: ', e)
      return null
    }
  }

  async newPlaygroundSession({
    url,
    app_name,
    anonymous_id,
  }): Promise<PlaygroundSessionInfo | null> {
    try {
      const resp = await axios.post(`${this.playgroundSessionsApi}`, {
        anonymous_id,
        url,
        app_name,
      })
      return resp.data as PlaygroundSessionInfo
    } catch (e) {
      console.error('Error creating Playground Session: ', e)
      return null
    }
  }

  get code(): string | undefined {
    return this.playgroundSession?.code
  }

  async stop(): Promise<void> {
    try {
      this.tunnel && (await this.tunnel.close())
      this.playgroundSession?.id &&
        (await axios.delete(
          `${this.playgroundSessionsApi}${this.playgroundSession.id}/`
        ))
    } catch (e) {
      console.log("Couldn't stop Playground session properly: ", e)
    }
  }
}
