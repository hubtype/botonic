import { ApiGatewayManagementApi } from 'aws-sdk'

export const WebSocketServer = ({ onConnect, onAuth, onDisconnect }) => {
  return {
    onConnect: async event => {
      const websocketId = event.requestContext.connectionId
      try {
        await onConnect(websocketId)
      } catch (err) {
        return {
          statusCode: 500,
          body: 'Failed to connect: ' + JSON.stringify(err),
        }
      }
      return { statusCode: 200, body: 'Connected successfully.' }
    },
    onAuth: async event => {
      const websocketId = event.requestContext.connectionId
      await onAuth({
        websocketId,
        data: event.body,
        send: async message => {
          const apigwManagementApi = new ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint:
              event.requestContext.domainName +
              '/' +
              event.requestContext.stage,
          })
          try {
            await apigwManagementApi
              .postToConnection({
                ConnectionId: websocketId,
                Data: JSON.stringify(message),
              })
              .promise()
          } catch (e) {
            if (e.statusCode === 410) {
              console.log(`Found stale connection, deleting ${websocketId}`)
            } else {
              throw e
            }
          }
        },
      })
      return { statusCode: 200, body: 'Data sent.' }
    },
    onDisconnect: async event => {
      const websocketId = event.requestContext.connectionId
      try {
        await onDisconnect(websocketId)
      } catch (err) {
        return {
          statusCode: 500,
          body: 'Failed to disconnect: ' + JSON.stringify(err),
        }
      }
      return { statusCode: 200, body: 'Disconnected.' }
    },
  }
}
