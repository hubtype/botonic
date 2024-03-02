import { NodeApp } from '@botonic/react'
import { routes } from '../src/routes'
import { locales } from '../src/locales'
import { plugins } from '../src/plugins'
import { config } from '../src'

export const app = new NodeApp({ routes, locales, plugins, ...config })
