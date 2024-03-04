import path from 'path'

import { BotonicProject } from './interfaces'

const GITHUB_EXAMPLES_PATH = 'hubtype/botonic-examples'

export const EXAMPLES: BotonicProject[] = [
  {
    name: 'blank',
    description: 'Blank: A minimal template to start from scratch',
    uri: `${GITHUB_EXAMPLES_PATH}/blank`,
    localTestPath: path.resolve(__dirname, '../../../examples/blank'),
  },
  {
    name: 'blank-typescript',
    description: 'Blank (TypeScript): A minimal template to start from scratch',
    uri: `${GITHUB_EXAMPLES_PATH}/blank-typescript`,
    localTestPath: path.resolve(
      __dirname,
      '../../../examples/blank-typescript'
    ),
  },
  {
    name: 'booking-platform',
    description:
      'Booking Platform: Use custom messages and webviews in order to book a reservation in a hotel',
    uri: `${GITHUB_EXAMPLES_PATH}/booking-platform`,
    localTestPath: '../../../examples/booking-platform',
  },
  {
    name: 'childs',
    description: 'Childs: Understand how childRoutes works',
    uri: `${GITHUB_EXAMPLES_PATH}/childs`,
    localTestPath: '../../../examples/childs',
  },
  {
    name: 'custom-webchat',
    description: 'Custom Webchat: See how it looks like a custom webchat',
    uri: `${GITHUB_EXAMPLES_PATH}/custom-webchat`,
    localTestPath: '../../../examples/custom-webchat',
  },
  {
    name: 'dynamic-carousel',
    description: 'Dynamic Carousel: See a dynamic carousel for Facebook',
    uri: `${GITHUB_EXAMPLES_PATH}/dynamic-carousel`,
    localTestPath: '../../../examples/dynamic-carousel',
  },
  {
    name: 'dynamodb',
    description: 'DynamoDB: Using AWS DynamoDB to track events.',
    uri: `${GITHUB_EXAMPLES_PATH}/dynamodb`,
    localTestPath: '../../../examples/dynamodb',
  },
  {
    name: 'handoff',
    description:
      'Handoff: Test how to transfer a conversation into Hubtype Desk',
    uri: `${GITHUB_EXAMPLES_PATH}/handoff`,
    localTestPath: '../../../examples/handoff',
  },
  {
    name: 'intent',
    description: 'Bot that uses external AI like DialogFlow.',
    uri: `${GITHUB_EXAMPLES_PATH}/intent`,
    localTestPath: '../../../examples/intent',
  },
  {
    name: 'telco-offers',
    description:
      'Telco Offers: Flow to acquire an Internet or a cell phone rate using buttons and replies',
    uri: `${GITHUB_EXAMPLES_PATH}/telco-offers`,
    localTestPath: '../../../examples/teleco-offers',
  },
  {
    name: 'tutorial',
    description:
      'Tutorial: An example with different examples that help you get started fast',
    uri: `${GITHUB_EXAMPLES_PATH}/tutorial`,
    localTestPath: '../../../examples/tutorial',
  },
]
