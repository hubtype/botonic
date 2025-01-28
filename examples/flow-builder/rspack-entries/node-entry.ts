import { NodeApp } from '@botonic/react'

import { config } from '../src'
import { plugins } from '../src/server/plugins'
import { routes } from '../src/server/routes'
import { locales } from '../src/shared/locales'

export const app = new NodeApp({ routes, locales, plugins, ...config })
