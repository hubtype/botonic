import { NodeApp } from '@botonic/react/lib/esm'

import { config } from '../src'
import { locales } from '../src/locales'
import { plugins } from '../src/plugins'
import { routes } from '../src/routes'

module.exports = new NodeApp({ routes, locales, plugins, ...config })
