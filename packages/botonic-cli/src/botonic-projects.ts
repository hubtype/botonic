export interface BotonicProject {
  name: string
  description: string
  uri: string
}

const GITHUB_PATH = 'hubtype/botonic/packages/botonic-examples' // This will be the new endpoint
// TODO: Replace below uris to be hubtype/botonic-examples/{templates/examples}
const GITHUB_TEMPLATES_PATH = 'hubtype/botonic/packages/botonic-cli/templates'
const GITHUB_EXAMPLES_PATH = 'hubtype/botonic-examples/'

export const TEMPLATES: BotonicProject[] = [
  {
    name: 'tutorial',
    description:
      'Tutorial: A template with different examples that help you get started fast',
    uri: `${GITHUB_TEMPLATES_PATH}/tutorial`,
  },
  {
    name: 'blank',
    description: 'Blank: A minimal template to start from scratch',
    uri: `${GITHUB_TEMPLATES_PATH}/blank`,
  },
  {
    name: 'childs',
    description: 'Childs: Understand how childRoutes works',
    uri: `${GITHUB_TEMPLATES_PATH}/childs`,
  },
  {
    name: 'dynamic-carousel',
    description: 'Dynamic Carousel: See a dynamic carousel for Facebook',
    uri: `${GITHUB_TEMPLATES_PATH}/dynamic-carousel`,
  },
  {
    name: 'dynamodb',
    description: 'DynamoDB: Using AWS DynamoDB to track events.',
    uri: `${GITHUB_TEMPLATES_PATH}/dynamodb`,
  },
  {
    name: 'handoff',
    description:
      'Handoff: Test how to transfer a conversation into Hubtype Desk',
    uri: `${GITHUB_TEMPLATES_PATH}/handoff`,
  },
  {
    name: 'intent',
    description: 'Intent: Integrate NLU and see the magic!',
    uri: `${GITHUB_TEMPLATES_PATH}/intent`,
  },
  {
    name: 'custom-webchat',
    description: 'Custom Webchat: See how it looks like a custom webchat',
    uri: `${GITHUB_TEMPLATES_PATH}/custom-webchat`,
  },
  {
    name: 'nlu',
    description: 'NLU: Train with your own intents with @botonic/plugin-nlu!',
    uri: `${GITHUB_TEMPLATES_PATH}/nlu`,
  },
]

export const EXAMPLES: BotonicProject[] = [
  {
    name: 'booking-platform',
    description:
      'Booking Platform: Use custom messages and webviews in order to book a reservation in a hotel',
    uri: `${GITHUB_EXAMPLES_PATH}/example-hotel-reservation`,
  },
  {
    name: 'nlu-assistant',
    description:
      'NLU Assistant: Train your own NLU model in order to understand your user intents',
    uri: `${GITHUB_EXAMPLES_PATH}/example-nlu`,
  },
]
