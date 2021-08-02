import { BotonicEvent } from '@botonic/core/src/models/events'
import { Router } from 'express'
import { checkSchema, matchedData, validationResult } from 'express-validator'

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
  .post(async (req, res) => {
    const errors = await validateBotonicEventData({ request: req })
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array({ onlyFirstError: true }) })
      return
    }

    try {
      const event = matchedData(req, { locations: ['body'] }) as BotonicEvent
      const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
      if (await dp.getEvent(event.eventId)) {
        res
          .status(409)
          .send({ error: `Event with ID '${event.eventId} already exists` })
      }
      const storedEvent = await dp.saveEvent(event)
      res.status(201).send(storedEvent)
    } catch (e) {
      res.status(500).send({ error: e.message })
    }
  })

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
