import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { AIMessage, BaseMessage, SystemMessage } from '@langchain/core/messages'
import { StructuredTool, tool } from '@langchain/core/tools'
import {
  Annotation,
  END,
  messagesStateReducer,
  START,
  StateGraph,
} from '@langchain/langgraph'
import { ToolNode } from '@langchain/langgraph/prebuilt'
import { z } from 'zod'

export const outOfContext = tool(
  async () => {
    console.log('Tool: finishConversation')
    return null
  },
  {
    name: 'outOfContext',
    description:
      'Use this to exit the conversation because the user is asking for something that is not context-related.',
    schema: z.object({}),
  }
)

export const finishConversation = tool(
  async () => {
    console.log('Tool: finishConversation')
    return null
  },
  {
    name: 'finishConversation',
    description: 'Use this to finish the conversation.',
    schema: z.object({}),
  }
)

export const messageResponse = tool(
  async (input: { messages: any[] }) => {
    console.log('Tool: messageResponse', input)
    return input
  },
  {
    name: 'messageResponse',
    description: 'Use this to respond to the user.',
    schema: z.object({
      messages: z.array(
        z.union([
          z.object({
            type: z.enum(['text']),
            content: z.object({ text: z.string() }),
          }),
          z.object({
            type: z.enum(['textWithButtons']),
            content: z.object({
              text: z.string(),
              buttons: z.array(z.string()),
            }),
          }),
        ])
      ),
    }),
  }
)

export const MANDATORY_TOOLS = [
  outOfContext,
  finishConversation,
  messageResponse,
]

export function createHubtypeAIAgent(
  llm: BaseChatModel,
  tools: StructuredTool[],
  instructions: string
) {
  const finalTools = [...tools, ...MANDATORY_TOOLS]
  const llmWithTools =
    llm.bindTools?.(finalTools, {
      tool_choice: 'any',
    }) || llm

  const prompt = `${instructions}\n\n## Metadata:\n- Current date: ${new Date().toLocaleDateString()}`

  const AgenticState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
      reducer: messagesStateReducer,
      default: () => [new SystemMessage(prompt)],
    }),
    output: Annotation<Record<string, any>>(),
  })

  const callModel = async (state: typeof AgenticState.State) => {
    console.log('Node: callModel')
    console.log(state.messages)
    const response = await llmWithTools.invoke(state.messages)
    return { messages: [response] }
  }

  const respond = async (state: typeof AgenticState.State) => {
    console.log('Node: respond')
    const lastMessage = state.messages.at(-1) as AIMessage
    const toolCalls = lastMessage.tool_calls || []
    if (toolCalls.length == 1 && toolCalls[0].name == 'messageResponse') {
      return { output: toolCalls[0].args.messages }
    }
    return {}
  }

  const exit = async (_state: typeof AgenticState.State) => {
    console.log('Node: exit')
    return { output: [{ type: 'exit' }] }
  }

  const shouldContinue = (state: typeof AgenticState.State): string => {
    console.log('Conditional edge: shouldContinue')
    const lastMessage = state.messages.at(-1) as AIMessage

    if (lastMessage.tool_calls?.length != 1) {
      return 'tools'
    }

    switch (lastMessage.tool_calls[0].name) {
      case 'outOfContext':
      case 'finishConversation':
        return 'exit'
      case 'messageResponse':
        return 'respond'
      default:
        return 'tools'
    }
  }

  const workflow = new StateGraph(AgenticState)
    .addNode('agent', callModel)
    .addNode('tools', new ToolNode(finalTools))
    .addNode('respond', respond)
    .addNode('exit', exit)
    .addEdge(START, 'agent')
    .addConditionalEdges('agent', shouldContinue, ['respond', 'tools', 'exit'])
    .addEdge('tools', 'agent')
    .addEdge('respond', END)
    .addEdge('exit', END)

  return workflow.compile()
}

// async function main() {
//   const agent = createHubtypeAIAgent(
//     llm,
//     MANDATORY_TOOLS,
//     'You are a fashion assistant. Before recommending, always ask for extra preferences in order to perform a better recommendation (genre, colors, size, etc.). Ask these preferences one by one by providing a list of buttons. Use rich messages whenever possible to improve the user experience.'
//   )
//   const response = await agent.invoke({
//     messages: [new HumanMessage('quiero una camiseta?')],
//   })
//   console.log(response.response)
// }

// main()
