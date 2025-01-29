import { createWebviewContentsContext } from '@botonic/plugin-flow-builder'

export const TRANSCRIPT_HEADER_IMAGE_URL = ''

export const FLOW_BUILDER_API_URL =
  process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'

export const WEBVIEW_ID = 'WEBVIEW_ID'

export const MAP_CONTENTS = { myContent: 'MY_CONTENT_ID' }

export const MyWebviewContentsContext =
  createWebviewContentsContext<typeof MAP_CONTENTS>()
