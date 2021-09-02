import axios from 'axios'

import { BotDispatcher, DispatchArgs } from '.'

export class LocalBotDispatcher implements BotDispatcher {
  botExecutor
  constructor(botExecutor: any) {
    this.botExecutor = botExecutor
  }
  async dispatch({
    input,
    session,
    lastRoutePath,
    websocketId,
  }: DispatchArgs): Promise<void> {
    const output = await this.botExecutor.run({
      input,
      session,
      lastRoutePath,
    })
    await this.sendEvents(output, websocketId)
  }
  async sendEvents(botOutput: any, websocketId: string): Promise<void> {
    const { parsedResponse } = botOutput
    for (const botEvent of parsedResponse) {
      try {
        // @ts-ignore
        await axios.post(`${WEBSOCKET_URL}send/`, {
          botEvent,
          websocketId,
        })
      } catch (e) {}
    }
  }
}
