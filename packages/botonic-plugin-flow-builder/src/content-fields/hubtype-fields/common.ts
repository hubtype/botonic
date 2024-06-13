import { HtNodeWithContentType, HtNodeWithoutContentType } from './node-types'
import { HtNodeComponent } from './nodes'

export interface HtFlowBuilderData {
  version: string
  name: string
  locales: string[]
  start_node_id?: string
  ai_model_id?: string
  is_knowledge_base_active?: boolean
  nodes: HtNodeComponent[]
  flows: HtFlows[]
}

export interface HtFlows {
  id: string
  name: string
  start_node_id: string
}

export interface HtNodeLink {
  id: string
  type: HtNodeWithContentType | HtNodeWithoutContentType
}

export interface HtBaseNode {
  id: string
  code: string
  meta: {
    x: number
    y: number
  }
  follow_up?: HtNodeLink
  target?: HtNodeLink
  flow_id: string // TODO: Review if this field is necessary in all HtBaseNode
  is_meaningful?: boolean
}

export interface HtTextLocale {
  message: string
  locale: string
}

export interface HtMediaFileLocale {
  id: string
  file: string
  locale: string
}

export interface HtVideoLocale {
  url: string
  is_embedded: boolean
  locale: string
}

export interface HtQueueLocale {
  id: string
  name: string
  locale: string
}

export interface HtInputLocale {
  values: string[]
  locale: string
}

export interface HtUrlLocale {
  id: string
  locale: string
}

export interface HtPayloadLocale {
  id: string
  locale: string
}
