import { User } from '@botonic/core'
import { Router } from 'express'
import { checkSchema, matchedData, validationResult } from 'express-validator'

import { dataProviderFactory } from '../../data-provider'
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
          const dataProvider = dataProviderFactory(
            process.env.DATA_PROVIDER_URL
          )
          const users = await dataProvider.getUsers(
            paginator.limit,
            paginator.offset
          )

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
        const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)
        if (await dataProvider.getUser(user.id)) {
          res
            .status(409)
            .send({ error: `User with ID '${user.id} already exists` })
        }
        const storedUser = await dataProvider.saveUser(user)
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
        const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)
        const user = await dataProvider.getUser(params.userId)
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

        const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)
        const user = await dataProvider.getUser(params.userId)
        if (!user) {
          res
            .status(404)
            .send({ error: `User with ID '${params.userId}' not found` })
          return
        }

        updatedUser.id = user.id
        await dataProvider.updateUser(updatedUser)
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

          const dataProvider = dataProviderFactory(
            process.env.DATA_PROVIDER_URL
          )
          const user = await dataProvider.getUser(params.userId)
          if (!user) {
            res
              .status(404)
              .send({ error: `User with ID '${params.userId}' not found` })
            return
          }

          newUserData.id = user.id
          const updatedUser = { ...user, ...newUserData }
          await dataProvider.updateUser(updatedUser)
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
        const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)
        const user = await dataProvider.deleteUser(params.userId)
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
