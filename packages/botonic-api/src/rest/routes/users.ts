import { User } from '@botonic/core/src/models/user'
import { Router } from 'express'
import { checkSchema, matchedData, validationResult } from 'express-validator'

import { dataProviderFactory } from '../../data-provider'
import {
  getOptionalSchema,
  limitParamSchema,
  offsetParamSchema,
} from './validation/common'
import {
  userIdParamSchema,
  userSchema,
  userWithUserIdParamSchema,
} from './validation/users'

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
        const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
        const users = await dp.getUsers(query.limit, query.offset)
        res.status(200).send(users)
      } catch (e) {
        res.status(500).send({ error: e.message })
      }
    }
  )
  .post(checkSchema(userSchema), async (req, res) => {
    const errors = await validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array({ onlyFirstError: true }) })
      return
    }

    try {
      const user = matchedData(req, { locations: ['body'] }) as User
      const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
      if (await dp.getUser(user.id)) {
        res
          .status(409)
          .send({ error: `User with ID '${user.id} already exists` })
      }
      const storedUser = await dp.saveUser(user)
      res.status(201).send(storedUser)
    } catch (e) {
      res.status(500).send({ error: e.message })
    }
  })

router
  .route('/:userId')
  .get(checkSchema({ userId: userIdParamSchema }), async (req, res) => {
    const errors = await validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() })
      return
    }

    try {
      const params = matchedData(req, { locations: ['params'] })
      const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
      const user = await dp.getUser(params.userId)
      if (!user) {
        res
          .status(404)
          .send({ error: `User with ID '${params.userId}' not found` })
        return
      }
      res.status(200).send(user)
    } catch (e) {
      res.status(500).send({ error: e.message })
    }
  })
  .put(checkSchema(userWithUserIdParamSchema), async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array({ onlyFirstError: true }) })
      return
    }

    try {
      const params = matchedData(req, { locations: ['params'] })
      const updatedUser = matchedData(req, {
        locations: ['body'],
      }) as User

      const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
      const user = await dp.getUser(params.userId)
      if (!user) {
        res
          .status(404)
          .send({ error: `User with ID '${params.userId}' not found` })
        return
      }
      if (user.id !== updatedUser.id) {
        res
          .status(400)
          .send({ error: `Both user ID (params and body) must match` })
        return
      }
      await dp.updateUser(updatedUser)
      res.status(200).send(updatedUser)
    } catch (e) {
      res.status(500).send({ error: e.message })
    }
  })
  .patch(
    checkSchema(getOptionalSchema(userWithUserIdParamSchema)),
    async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).send({ errors: errors.array({ onlyFirstError: true }) })
        return
      }

      try {
        const params = matchedData(req, { locations: ['params'] })
        const newUserData = matchedData(req, {
          locations: ['body'],
        }) as Partial<User>

        const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
        const user = await dp.getUser(params.userId)
        if (!user) {
          res
            .status(404)
            .send({ error: `User with ID '${params.userId}' not found` })
          return
        }
        if (newUserData.id && user.id !== newUserData.id) {
          res
            .status(400)
            .send({ error: `Both user ID (params and body) must match` })
          return
        }
        const updatedUser = { ...user, ...newUserData }
        await dp.updateUser(updatedUser)
        res.status(200).send(updatedUser)
      } catch (e) {
        res.status(500).send({ error: e.message })
      }
    }
  )
  .delete(checkSchema({ userId: userIdParamSchema }), async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() })
      return
    }

    try {
      const params = matchedData(req, { locations: ['params'] })
      const dp = dataProviderFactory(process.env.DATA_PROVIDER_URL)
      const user = await dp.deleteUser(params.userId)
      if (!user) {
        res
          .status(404)
          .send({ error: `User with ID '${params.userId}' not found` })
        return
      }
      res.status(200).send(user)
    } catch (e) {
      res.status(500).send({ error: e.message })
    }
  })

export default router
