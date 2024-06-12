import { HtBaseNode } from './common'
import { HtNodeWithContentType } from './node-types'

export interface HtKnowledgeBaseNode extends HtBaseNode {
  type: HtNodeWithContentType.KNOWLEDGE_BASE
  content: {
    sources: string[]
  }
}