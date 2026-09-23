import { NodeApp } from '@botonic/react'

import { config } from '../src'
import { locales } from '../src/locales'
import { plugins } from '../src/plugins'
import { routes } from '../src/routes'

export const app = new NodeApp({ routes, locales, plugins, ...config })
