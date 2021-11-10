import { BotonicEvent, MessageEventAck } from '@botonic/core'
import { BotonicOutputParser } from '@botonic/core'
import { Router } from 'express'
import jwt from 'express-jwt'
import { checkSchema, matchedData, validationResult } from 'express-validator'
import { ulid } from 'ulid'

import { dataProviderFactory } from '../../data-provider'
import { Commands } from '../../dispatchers'
import { createMessageEvent, createWebchatActionEvent } from '../../helpers'
import { Paginator } from '../utils/paginator'
import { SIGNATURE_ALGORITHM } from './auth'
import { pageParamSchema, pageSizeParamSchema } from './validation/common'
import {
  eventIdParamSchema,
  validateBotonicEventData,
} from './validation/events'

const botonicOutputParser = new BotonicOutputParser()

export default function eventsRouter(args: any): Router {
  const router = Router()
  const { dispatchers } = args
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
          const dataProvider = dataProviderFactory(
            process.env.DATA_PROVIDER_URL
          )
          const events = await dataProvider.getEvents(
            paginator.limit,
            paginator.offset
          )

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
    //     const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)
    //     if (await dataProvider.getEvent(event.eventId)) {
    //       res
    //         .status(409)
    //         .send({ error: `Event with ID '${event.eventId} already exists` })
    //     }
    //     const storedEvent = await dataProvider.saveEvent(event)
    //     res.status(201).send(storedEvent)
    //   } catch (e) {
    //     res.status(500).send({ error: e.message })
    //   }
    // })
    .post(
      jwt({
        secret: process.env.BOTONIC_JWT_SECRET,
        algorithms: [SIGNATURE_ALGORITHM],
      }),
      async (req: any, res: any) => {
        // TODO: Validate event
        const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)
        try {
          const { userId } = req.user
          const { message, sender } = req.body
          const input = message
          let user = await dataProvider.getUser(userId)
          // TODO: Decide how to update user with sender information
          const updatedUser = { ...user, ...sender }
          user = await dataProvider.updateUser(updatedUser)
          const parsedUserEvent = botonicOutputParser.inputToBotonicEvent(input)
          const receivedUserEvent = createMessageEvent({
            user,
            properties: { ...parsedUserEvent, ack: MessageEventAck.RECEIVED },
          })
          const userEvent = await dataProvider.saveEvent(receivedUserEvent)
          // TODO: Only update ack for webchat
          // TODO: Specific logic for webchat, move to webchat-events?
          const webchatMsgId = input.id
          await dispatchers.dispatch(Commands.SEND, {
            userId,
            events: [
              createWebchatActionEvent({
                action: 'update_message_info',
                user,
                properties: { id: webchatMsgId, ack: MessageEventAck.SENT },
              }),
            ],
          })
          await dispatchers.dispatch(Commands.EXECUTE_BOT, {
            userId,
            input: receivedUserEvent,
          })
        } catch (e) {
          console.log({ e })
          res.status(500).send(JSON.stringify(e))
        }
        res.status(200).send('OK')
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
        const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)
        const event = await dataProvider.getEvent(params.eventId)
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

        const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)
        const event = await dataProvider.getEvent(params.eventId)
        if (!event) {
          res
            .status(404)
            .send({ error: `Event with ID '${params.eventId}' not found` })
          return
        }

        updatedEvent.eventId = event.eventId
        await dataProvider.updateEvent(updatedEvent)
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

        const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)
        const event = await dataProvider.getEvent(params.eventId)
        if (!event) {
          res
            .status(404)
            .send({ error: `Event with ID '${params.eventId}' not found` })
          return
        }

        newEventData.eventId = event.eventId
        const updatedEvent = { ...event, ...newEventData } as BotonicEvent
        await dataProvider.updateEvent(updatedEvent)
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
        const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)
        const event = await dataProvider.deleteEvent(params.eventId)
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
  return router
}
