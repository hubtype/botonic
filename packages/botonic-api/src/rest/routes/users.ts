import { User } from '@botonic/core/lib/esm/models/user'
import { Router } from 'express'
import { checkSchema, matchedData, validationResult } from 'express-validator'

import { dataProviderFactory } from '@botonic/core/lib/esm/data-provider'
import { Paginator } from '../utils/paginator'
import {
  getOptionalSchema,
  pageParamSchema,
  pageSizeParamSchema,
} from './validation/common'
import {
  userIdParamSchema,
  userSchema,
  userWithUserIdParamSchema,
} from './validation/users'

export default function usersRouter(args) {
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
          const users = await dp.getUsers(paginator.limit, paginator.offset)

          const response = paginator.generateResponse(users)
          res.status(200).json(response)
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

        updatedUser.id = user.id
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
          res
            .status(400)
            .send({ errors: errors.array({ onlyFirstError: true }) })
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

          newUserData.id = user.id
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
  return router
}
