import { HtBaseNode } from './common'
import { HtNodeWithContentType } from './node-types'

interface SourceData {
  id: string
  name: string
}

export interface HtKnowledgeBaseNode extends HtBaseNode {
  type: HtNodeWithContentType.KNOWLEDGE_BASE
  content: {
    feedback_enabled: boolean
    sources_data: SourceData[]
  }
}
