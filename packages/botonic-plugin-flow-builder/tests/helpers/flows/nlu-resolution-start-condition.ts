/* eslint-disable @typescript-eslint/naming-convention */
import { aiAgentTestFlow } from './ai-agent'

const NLU_START_CONDITION_NODE_ID = '0196f220-a001-7000-b001-nlu-condition01'
const NLU_MATCHED_START_MESSAGE_NODE_ID =
  '0196f220-a002-7000-b002-nlu-matched-msg01'
const MAIN_WELCOME_NODE_ID = '0196f201-fdde-721c-b24a-2659cc5b82b7'

export const aiAgentNluStartConditionFlow = {
  ...aiAgentTestFlow,
  start_node_id: NLU_START_CONDITION_NODE_ID,
  nodes: [
    ...aiAgentTestFlow.nodes,
    {
      id: NLU_START_CONDITION_NODE_ID,
      code: 'keyword-or-intent-match-condition',
      is_code_ai_generated: false,
      meta: {
        x: 500.0,
        y: -50.0,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'custom-condition',
      content: {
        type: 'boolean',
        key_path: 'input.nluResolution',
        conditions: [
          {
            operator: 'isTruthy',
            target: {
              id: NLU_MATCHED_START_MESSAGE_NODE_ID,
              type: 'text',
            },
          },
        ],
        default_target: {
          id: MAIN_WELCOME_NODE_ID,
          type: 'text',
        },
      },
    },
    {
      id: NLU_MATCHED_START_MESSAGE_NODE_ID,
      code: 'legal-msg',
      is_code_ai_generated: false,
      meta: {
        x: 800.0,
        y: -50.0,
      },
      follow_up: null,
      target: null,
      flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      is_meaningful: false,
      ai_translated_locales: [],
      type: 'text',
      content: {
        text: [
          {
            message: 'Terms without welcome',
            locale: 'en',
          },
        ],
        buttons_style: 'button',
        buttons: [],
      },
    },
  ],
  flows: aiAgentTestFlow.flows.map(flow =>
    flow.name === 'Main'
      ? { ...flow, start_node_id: NLU_START_CONDITION_NODE_ID }
      : flow
  ),
}
