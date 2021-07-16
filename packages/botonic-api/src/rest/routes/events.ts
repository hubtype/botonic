import { BotonicEvent } from '@botonic/core/src/models/events'
import { Router } from 'express'
import { checkSchema, matchedData, validationResult } from 'express-validator'

import { dataProviderFactory } from '../../data-provider'
import {
  eventIdParamSchema,
  limitParamSchema,
  offsetParamSchema,
  validateBotonicEventData,
} from './validation/events'

const router = Router()

router
  .route('/')
  .get(
    checkSchema({
      limit: limitParamSchema,
      offset: offsetParamSchema,
    }),
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          res.status(400).send({ errors: errors.array() })
          return
        }

        const query = matchedData(req, { locations: ['query'] })
        const limit = query.limit ?? undefined
        const offset = query.offset ?? undefined
        const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
        const events = await dp.getEvents(limit, offset)
        res.status(200).send(events)
      } catch (e) {
        res.status(500).send({ error: e.message })
      }
    }
  )
  .post(async (req, res) => {
    const errors = await validateBotonicEventData(req)
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
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).send({ errors: errors.array() })
        return
      }

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
  .put(checkSchema({ eventId: eventIdParamSchema }), async (req, res) => {
    const errors = await validateBotonicEventData(req)
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array({ onlyFirstError: true }) })
      return
    }

    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).send({ errors: errors.array() })
        return
      }

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
      await dp.updateEvent(updatedEvent)
      res.status(200).send(updatedEvent)
    } catch (e) {
      res.status(500).send({ error: e.message })
    }
  })
  .patch(checkSchema({ eventId: eventIdParamSchema }), async (req, res) => {
    const errors = await validateBotonicEventData(req, true)
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array({ onlyFirstError: true }) })
      return
    }

    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).send({ errors: errors.array() })
        return
      }

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
