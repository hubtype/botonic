import { NodeApp } from '@botonic/react'

import { config } from '../src'
import { plugins } from '../src/server/plugins'
import { routes } from '../src/server/routes'

export const app = new NodeApp({ routes, locales: {}, plugins, ...config })
