import { ApiGatewayManagementApi } from 'aws-sdk'

import { BotDispatcher, DispatchArgs } from '.'

export class AWSBotDispatcher implements BotDispatcher {
  bot
  constructor(bot) {
    this.bot = bot
  }
  async dispatch(args: DispatchArgs): Promise<void> {
    const output = await this.bot.app.input({
      input: args.input,
      session: args.session,
      lastRoutePath: args.lastRoutePath,
    })
    await this.sendEvents(output, args.websocketId)
  }
  async sendEvents(botOutput: any, websocketId: string): Promise<void> {
    // @ts-ignore
    const websocketEndpoint = process.env.WEBSOCKET_URL.split('wss://')[1]
    const apigwManagementApi = new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: websocketEndpoint,
    })
    const { parsedResponse } = botOutput
    for (const botEvent of parsedResponse) {
      try {
        await apigwManagementApi
          .postToConnection({
            ConnectionId: websocketId,
            Data: JSON.stringify(botEvent),
          })
          .promise()
      } catch (e) {
        console.log('ERR POSTING TO CONNECTION', { e })
      }
    }
  }
}
