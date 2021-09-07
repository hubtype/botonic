import { ApiGatewayManagementApi } from 'aws-sdk'

const apigwManagementApi = new ApiGatewayManagementApi({
  apiVersion: '2018-11-29',
  endpoint: process.env.WEBSOCKET_URL.split('wss://')[1],
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
