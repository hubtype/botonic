import ApiGatewayManagementApi from 'aws-sdk/clients/apigatewaymanagementapi'

import { WSS_PROTOCOL_PREFIX } from '../..'

const apiGwManagementApi = new ApiGatewayManagementApi({
  apiVersion: '2018-11-29',
  endpoint: process.env.WEBSOCKET_URL?.split(WSS_PROTOCOL_PREFIX)[1],
})

// TODO: Rename to webchatSender
export async function awsSender({ event, websocketId }) {
  await apiGwManagementApi
    .postToConnection({
      ConnectionId: websocketId,
      Data: JSON.stringify(event),
    })
    .promise()
}