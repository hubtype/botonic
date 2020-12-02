export interface BotonicProject {
  name: string
  description: string
  uri: string
}

const GITHUB_EXAMPLES_PATH = 'hubtype/botonic-examples/'

export const EXAMPLES: BotonicProject[] = [
  {
    name: 'booking-platform',
    description:
      'Booking Platform: Use custom messages and webviews in order to book a reservation in a hotel',
    uri: `${GITHUB_EXAMPLES_PATH}/booking-platform`,
  },
  {
    name: 'nlu-assistant',
    description:
      'NLU Assistant: Train your own NLU model in order to understand your user intents',
    uri: `${GITHUB_EXAMPLES_PATH}/nlu-assistant`,
  },
  {
    name: 'telco-offers',
    description:
      'Telco Offers: Flow to acquire an Internet or a cell phone rate using buttons and replies',
    uri: `${GITHUB_EXAMPLES_PATH}/telco-offers`,
  },
  {
    name: 'blank',
    description: 'Blank: A minimal template to start from scratch',
    uri: `${GITHUB_EXAMPLES_PATH}/blank`,
  },
  {
    name: 'tutorial',
    description:
      'Tutorial: An example with different examples that help you get started fast',
    uri: `${GITHUB_EXAMPLES_PATH}/tutorial`,
  },
  {
    name: 'custom-webchat',
    description: 'Custom Webchat: See how it looks like a custom webchat',
    uri: `${GITHUB_EXAMPLES_PATH}/custom-webchat`,
  },
  {
    name: 'nlu',
    description: 'NLU: Train with your own intents with @botonic/plugin-nlu!',
    uri: `${GITHUB_EXAMPLES_PATH}/nlu`,
  },
  {
    name: 'handoff',
    description:
      'Handoff: Test how to transfer a conversation into Hubtype Desk',
    uri: `${GITHUB_EXAMPLES_PATH}/handoff`,
  },
  {
    name: 'intent',
    description: 'Intent: Integrate NLU and see the magic!',
    uri: `${GITHUB_EXAMPLES_PATH}/intent`,
  },
  {
    name: 'dynamic-carousel',
    description: 'Dynamic Carousel: See a dynamic carousel for Facebook',
    uri: `${GITHUB_EXAMPLES_PATH}/dynamic-carousel`,
  },
  {
    name: 'childs',
    description: 'Childs: Understand how childRoutes works',
    uri: `${GITHUB_EXAMPLES_PATH}/childs`,
  },
  {
    name: 'dynamodb',
    description: 'DynamoDB: Using AWS DynamoDB to track events.',
    uri: `${GITHUB_EXAMPLES_PATH}/dynamodb`,
  },
]
