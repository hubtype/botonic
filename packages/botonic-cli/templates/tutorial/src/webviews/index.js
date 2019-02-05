import { WebviewApp } from '@botonic/react'

import { locales } from '../locales'
import MyWebview from './components/myWebview'
import InteractionWithBot from './components/interactionWithBot'

const webviews = [MyWebview, InteractionWithBot]

export default new WebviewApp({ webviews, locales })
