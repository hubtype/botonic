import axios from 'axios'

import { BotDispatcher, DispatchArgs } from '.'

export class LocalBotDispatcher implements BotDispatcher {
  bot
  constructor(bot: any) {
    this.bot = bot
  }
  async dispatch({
    input,
    session,
    lastRoutePath,
    websocketId,
  }: DispatchArgs): Promise<void> {
    const output = await this.bot.app.input({
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
