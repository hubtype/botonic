import { Router } from 'express'

const router = Router()

router
  .route('/')
  .get((_, res) => {
    res.send('GET HTTP method on event resource')
  })
  .post((_, res) => {
    res.send('POST HTTP method on event resource')
  })

router
  .route('/:eventId')
  .get((_, res) => {
    const event: any = {
      type: 'message',
      data: {
        type: 'text',
        text: 'Hola',
      },
    }
    return res.json(event)
  })
  .put((req, res) => {
    return res.send(`PUT HTTP method on event/${req.params.eventId} resource`)
  })
  .patch((req, res) => {
    return res.send(`PATCH HTTP method on event/${req.params.eventId} resource`)
  })
  .delete((req, res) => {
    return res.send(
      `DELETE HTTP method on event/${req.params.eventId} resource`
    )
  })

export default router
