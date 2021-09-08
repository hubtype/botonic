import * as express from 'express'
import * as cors from 'cors'
import * as morgan from 'morgan'
import { routes } from '@botonic/api/src/rest/routes'

export function getApp(env: string, args: any) {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors())
  app.use(morgan('tiny'))
  app.use(routes(args))
  return app
}
