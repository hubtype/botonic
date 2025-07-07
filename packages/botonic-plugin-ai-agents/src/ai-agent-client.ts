// import { BaseChatModel } from '@langchain/core/language_models/chat_models'
// import {
//   AgenticInputMessage,
//   AgenticOutputMessage,
//   AiAgentArgs,
//   AssistantMessage,
//   ExitMessage,
//   ToolMessage,
// } from './types'

// export class AiAgentClient {
//   constructor(
//     aiAgentArgs: AiAgentArgs,
//     chatModel: BaseChatModel,
//     tools: StructuredTool[] = []
//   ) {
//     this.agent = createReactAgent({
//       name: aiAgentArgs.name,
//       llm: chatModel,
//       tools: tools,
//       prompt: `${aiAgentArgs.instructions}\n\n## Metadata:\n- Current date: ${new Date().toLocaleDateString()}`,
//     })
//   }

//   async runAgent(
//     _messages: AgenticInputMessage[]
//   ): Promise<AgenticOutputMessage> {
//     const response = await this.agent.invoke({
//       messages: _messages.map((message: AgenticInputMessage) => ({
//         role: message.role,
//         content: message.content,
//       })),
//     })
//     const lastMessage = response.messages.at(-1)

//     if (lastMessage instanceof LangchainToolMessage) {
//       if (lastMessage.name && EXIT_TOOLS_NAMES.includes(lastMessage.name)) {
//         return {
//           role: 'exit',
//         } as ExitMessage
//       }
//       return {
//         role: 'tool',
//         toolName: lastMessage.name,
//         toolOutput: lastMessage.content,
//       } as ToolMessage
//     }

//     if (lastMessage instanceof LangchainAIMessage) {
//       return {
//         role: 'assistant',
//         content: lastMessage.content,
//       } as AssistantMessage
//     }

//     throw new Error('Last message is not a valid message')
//   }
// }
