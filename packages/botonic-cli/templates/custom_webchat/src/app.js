import { App } from '@botonic/react'

import { routes } from './routes'
import { locales } from './locales'
import { integrations } from './integrations'
import { theme } from './webchat'

export default new App({ routes, locales, integrations, theme })
