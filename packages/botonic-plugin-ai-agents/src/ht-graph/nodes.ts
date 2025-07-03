// import { AgenticState } from './state'

// import { llmWithTools } from './llm'
// import { AIMessage } from '@langchain/core/messages'

// export const callModel = async (state: typeof AgenticState.State) => {
//   console.log('Node: callModel')
//   const response = await llmWithTools.invoke(state.messages)
//   return { messages: [response] }
// }

// export const respond = async (state: typeof AgenticState.State) => {
//   console.log('Node: respond')
//   const lastMessage = state.messages.at(-1) as AIMessage
//   const toolCalls = lastMessage.tool_calls || []
//   if (toolCalls.length == 1 && toolCalls[0].name == 'messageResponse') {
//     return { response: toolCalls[0].args }
//   }
//   return {}
// }
