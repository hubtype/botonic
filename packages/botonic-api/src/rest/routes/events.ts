import {
  MessageEventAck,
  MessageEventFrom,
} from '@botonic/core/lib/models/events/message'
import { BotonicOutputParser } from '@botonic/core/lib/output-parser'
import { BotonicEvent } from '@botonic/core/src/models/events'
import { ApiGatewayManagementApi } from 'aws-sdk'
import { Router } from 'express'
import jwt from 'express-jwt'
import { checkSchema, matchedData, validationResult } from 'express-validator'
import { ulid } from 'ulid'

import { dataProviderFactory } from '../../data-provider'
import { Paginator } from '../utils/paginator'
import { pageParamSchema, pageSizeParamSchema } from './validation/common'
import {
  eventIdParamSchema,
  validateBotonicEventData,
} from './validation/events'

const router = Router()

router
  .route('/')
  .get(
    checkSchema({
      page: pageParamSchema,
      pageSize: pageSizeParamSchema,
    }),
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          res.status(400).send({ errors: errors.array() })
          return
        }

        const query = matchedData(req, { locations: ['query'] })
        const paginator = new Paginator(req, query.page, query.pageSize)
        const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
        const events = await dp.getEvents(paginator.limit, paginator.offset)

        const response = paginator.generateResponse(events)
        res.status(200).json(response)
      } catch (e) {
        res.status(500).send({ error: e.message })
      }
    }
  )
  // // Current route
  // .post(async (req, res) => {
  //   const errors = await validateBotonicEventData({ request: req })
  //   if (!errors.isEmpty()) {
  //     res.status(400).send({ errors: errors.array({ onlyFirstError: true }) })
  //     return
  //   }

  //   try {
  //     const event = matchedData(req, { locations: ['body'] }) as BotonicEvent
  //     const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
  //     if (await dp.getEvent(event.eventId)) {
  //       res
  //         .status(409)
  //         .send({ error: `Event with ID '${event.eventId} already exists` })
  //     }
  //     const storedEvent = await dp.saveEvent(event)
  //     res.status(201).send(storedEvent)
  //   } catch (e) {
  //     res.status(500).send({ error: e.message })
  //   }
  // })
  .post(
    jwt({ secret: 'shhhhhh', algorithms: ['HS256'] }),
    async (req: any, res: any) => {
      // TODO: Validate event
      const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
      const botonicOutputParser = new BotonicOutputParser()
      const { userId } = req.user
      const { message, sender } = req.body
      let user = await dp.getUser(userId)
      user = await dp.updateUser({
        ...user,
        session: JSON.stringify({ user: sender }),
      })
      const parsedUserEvent = botonicOutputParser.parseFromUserInput(message)
      const newUserEvent = await dp.saveEvent({
        ...parsedUserEvent,
        userId,
        eventId: ulid(),
        createdAt: new Date().toISOString(),
        from: MessageEventFrom.USER,
        ack: MessageEventAck.SENT,
      })
      // TODO: DispatchBotEvent
      const botEvent = await dp.saveEvent({
        ...newUserEvent,
        eventId: ulid(),
        createdAt: new Date().toISOString(),
        from: MessageEventFrom.BOT,
        text: 'Hello from bot!',
      })
      try {
        const { websocketId } = user
        // @ts-ignore
        const websocketEndpoint = process.env.WEBSOCKET_URL.split('wss://')[1]
        const apigwManagementApi = new ApiGatewayManagementApi({
          apiVersion: '2018-11-29',
          endpoint: websocketEndpoint,
        })
        await apigwManagementApi
          .postToConnection({
            ConnectionId: websocketId,
            Data: JSON.stringify(botEvent),
          })
          .promise()
        res.status(200).send(botEvent)
      } catch (error) {
        res.status(500).send({ error })
      }
      // TODO: Finally, update user
    }
  )

router
  .route('/:eventId')
  .get(checkSchema({ eventId: eventIdParamSchema }), async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() })
      return
    }

    try {
      const params = matchedData(req, { locations: ['params'] })
      const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
      const event = await dp.getEvent(params.eventId)
      if (!event) {
        res
          .status(404)
          .send({ error: `Event with ID '${params.eventId}' not found` })
        return
      }
      res.status(200).send(event)
    } catch (e) {
      res.status(500).send({ error: e.message })
    }
  })
  .put(async (req, res) => {
    const errors = await validateBotonicEventData({
      request: req,
      allFieldsOptional: false,
      withParamEventId: true,
    })
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array({ onlyFirstError: true }) })
      return
    }

    try {
      const params = matchedData(req, { locations: ['params'] })
      const updatedEvent = matchedData(req, {
        locations: ['body'],
      }) as BotonicEvent

      const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
      const event = await dp.getEvent(params.eventId)
      if (!event) {
        res
          .status(404)
          .send({ error: `Event with ID '${params.eventId}' not found` })
        return
      }

      updatedEvent.eventId = event.eventId
      await dp.updateEvent(updatedEvent)
      res.status(200).send(updatedEvent)
    } catch (e) {
      res.status(500).send({ error: e.message })
    }
  })
  .patch(async (req, res) => {
    const errors = await validateBotonicEventData({
      request: req,
      allFieldsOptional: true,
      withParamEventId: true,
    })
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array({ onlyFirstError: true }) })
      return
    }

    try {
      const params = matchedData(req, { locations: ['params'] })
      const newEventData = matchedData(req, {
        locations: ['body'],
      }) as Partial<BotonicEvent>

      const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
      const event = await dp.getEvent(params.eventId)
      if (!event) {
        res
          .status(404)
          .send({ error: `Event with ID '${params.eventId}' not found` })
        return
      }

      newEventData.eventId = event.eventId
      const updatedEvent = { ...event, ...newEventData } as BotonicEvent
      await dp.updateEvent(updatedEvent)
      res.status(200).send(updatedEvent)
    } catch (e) {
      res.status(500).send({ error: e.message })
    }
  })
  .delete(checkSchema({ eventId: eventIdParamSchema }), async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).send({ errors: errors.array() })
        return
      }

      const params = matchedData(req, { locations: ['params'] })
      const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
      const event = await dp.deleteEvent(params.eventId)
      if (!event) {
        res
          .status(404)
          .send({ error: `Event with ID '${params.eventId}' not found` })
        return
      }
      res.status(200).send(event)
    } catch (e) {
      res.status(500).send({ error: e.message })
    }
  })

export default router
