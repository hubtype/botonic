import { WebviewApp } from '@botonic/react'

import { webviews } from '../src/client/webviews'

export const app = new WebviewApp({ webviews, locales: {} })
