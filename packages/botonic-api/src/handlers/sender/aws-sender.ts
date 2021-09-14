import { ApiGatewayManagementApi } from 'aws-sdk'

import { WSS_PROTOCOL_PREFIX } from '../..'

const apiGwManagementApi = new ApiGatewayManagementApi({
  apiVersion: '2018-11-29',
  endpoint: process.env.WEBSOCKET_URL?.split(WSS_PROTOCOL_PREFIX)[1],
})

export async function awsSender({ events, websocketId }) {
  for (const event of events) {
    await apiGwManagementApi
      .postToConnection({
        ConnectionId: websocketId,
        Data: JSON.stringify(event),
      })
      .promise()
  }
}
