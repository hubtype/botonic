import { ApiGatewayManagementApi } from 'aws-sdk'

import { WSS_PROTOCOL_PREFIX } from '../..'

const apigwManagementApi = new ApiGatewayManagementApi({
  apiVersion: '2018-11-29',
  endpoint: process.env.WEBSOCKET_URL.split(WSS_PROTOCOL_PREFIX)[1],
})

export async function awsSender({ messages, websocketId }) {
  for (const message of messages) {
    await apigwManagementApi
      .postToConnection({
        ConnectionId: websocketId,
        Data: JSON.stringify(message),
      })
      .promise()
  }
}
