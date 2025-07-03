// import { StateGraph, START, END } from '@langchain/langgraph'
// import { MessagesAnnotation } from '@langchain/langgraph'
// import { callModel, respond } from './nodes'
// import { shouldContinue } from './edges'
// import { ToolNode } from '@langchain/langgraph/prebuilt'
// import { TOOLS } from './tools'
// import { HumanMessage } from '@langchain/core/messages'
// const workflow = new StateGraph(MessagesAnnotation)
//   .addNode('agent', callModel)
//   .addNode('tools', new ToolNode(TOOLS))
//   .addNode('respond', respond)
//   .addEdge(START, 'agent')
//   .addConditionalEdges('agent', shouldContinue, ['respond', 'tools'])
//   .addEdge('tools', 'agent')
//   .addEdge('respond', END)

// const graph = workflow.compile()

// async function main() {
//   const result = await graph.invoke({
//     messages: new HumanMessage('Que opciones hay a la hora de comer?'),
//   })
// }

// main()
