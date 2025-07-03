// import { MessagesAnnotation } from '@langchain/langgraph'

// import { llmWithTools } from './llm'
// import { AIMessage } from '@langchain/core/messages'

// export const callModel = async (state: typeof MessagesAnnotation.State) => {
//   console.log('Node: callModel')
//   const response = await llmWithTools.invoke(state.messages)
//   return { messages: [response] }
// }

// export const respond = async (state: typeof MessagesAnnotation.State) => {
//   console.log('Node: respond')
//   const lastMessage = state.messages.at(-1) as AIMessage
//   const toolCalls = lastMessage.tool_calls || []
//   if (toolCalls.length == 1 && toolCalls[0].name == 'weatherResponse') {
//     const toolCall = toolCalls[0]
//     console.log('Final Structured Response:', toolCall.args)
//   }
//   return {}
// }
