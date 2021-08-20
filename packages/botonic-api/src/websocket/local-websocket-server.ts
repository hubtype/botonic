import chalk from 'chalk'
import { v4 } from 'uuid'
import { Server } from 'ws'

export const localWebSocketServer = ({ onConnect, onAuth, onDisconnect }) => {
  const wss = new Server({ port: parseInt(process.env.PORT as string) })
  console.log(
    `${chalk.bold('Botonic WebSocket API')} listening on port ${chalk.bold(
      process.env.PORT
    )}`
  )
  wss.on('connection', function connection(ws: any) {
    ws.id = v4()
    onConnect(ws.id)
    ws.on('message', async function incoming(data) {
      onAuth({
        websocketId: ws.id,
        data,
        send: message => ws.send(JSON.stringify(message)),
      })
    })
    ws.on('close', () => onDisconnect(ws.id))
  })
  return wss
}
