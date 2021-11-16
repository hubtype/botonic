import { ApiGatewayManagementApi } from 'aws-sdk'

import { publishNewUser } from '../notifying'
import { doAuth } from './onauth'
import { doDisconnect } from './ondisconnect'

const eventHandlers = {
  onNewUser: publishNewUser,
}

export const AWSWebsocketServer = ({
  onConnect,
  onAuth,
  onDisconnect,
  dataProvider,
}) => {
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
      const { requestContext } = event
      const websocketId = requestContext.connectionId
      await doAuth({
        websocketId,
        data: event.body,
        send: async message => {
          const apiGwManagementApi = new ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint: `${requestContext.domainName}/${requestContext.stage}`,
          })
          try {
            await apiGwManagementApi
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
        dataProvider,
        eventHandlers,
      })
      await onAuth({ websocketId })
      return { statusCode: 200, body: 'Data sent.' }
    },
    onDisconnect: async event => {
      const websocketId = event.requestContext.connectionId
      try {
        await doDisconnect(websocketId, dataProvider)
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
