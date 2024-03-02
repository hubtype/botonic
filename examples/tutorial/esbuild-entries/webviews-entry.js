import { WebviewApp } from '@botonic/react'

import { locales } from '../src/locales'
import { webviews } from '../src/webviews'

module.exports = new WebviewApp({ webviews, locales })
