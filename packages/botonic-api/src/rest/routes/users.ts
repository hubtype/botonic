import { Router } from 'express'
// import { dataProviderFactory } from '../../data-provider/'
// import { ApiGatewayManagementApi } from 'aws-sdk'

const router = Router()

router
  .route('/')
  .get((_, res) => {
    res.send('GET HTTP method on user resource')
  })
  .post((_, res) => {
    res.send('POST HTTP method on user resource')
  })

router
  .route('/:userId')
  .get((req, res) => {
    return res.send(`GET HTTP method on user/${req.params.userId} resource`)
  })
  .put((req, res) => {
    return res.send(`PUT HTTP method on user/${req.params.userId} resource`)
  })
  .patch((req, res) => {
    return res.send(`PATCH HTTP method on user/${req.params.userId} resource`)
  })
  .delete((req, res) => {
    return res.send(`DELETE HTTP method on user/${req.params.userId} resource`)
  })
//// TODO: TEST (worked): User has to previously post a message to the websocket connection in order to have its websocket_id updated
// .post(async (req, res) => {
//   const userId = req.params.userId
//   let user = undefined
//   try {
//     var dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
//     user = await dp.getUser(userId)
//     const { websocketId } = user
//     const websocketEndpoint = process.env.WEBSOCKET_URL.split('wss://')[1]
//     const apigwManagementApi = new ApiGatewayManagementApi({
//       apiVersion: '2018-11-29',
//       endpoint: websocketEndpoint,
//     })
//     await apigwManagementApi
//       .postToConnection({
//         ConnectionId: websocketId,
//         Data: JSON.stringify('hello from rest-server'),
//       })
//       .promise()
//   } catch (e) {
//     console.log({ e })
//   }
//   return res.send(`POST HTTP method on user/${req.params.userId}`)
// })

export default router
