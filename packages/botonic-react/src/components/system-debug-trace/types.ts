import { NluKeywordDebugEvent } from './events/nlu-keyword'

// Union type of all debug event types
export type DebugEvent = NluKeywordDebugEvent // | KnowledgeBaseDebugEvent | SmartIntentDebugEvent
