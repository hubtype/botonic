import path from 'path'

import { BotonicProject } from './interfaces'

export const EXAMPLES: BotonicProject[] = [
  {
    name: 'blank',
    description: 'Blank: A minimal template to start from scratch',
    version: '0.25.0-alpha.0',
    localTestPath: path.resolve(__dirname, '../../../examples/blank'),
  },
  {
    name: 'blank-typescript',
    description: 'Blank (TypeScript): A minimal template to start from scratch',
    version: '0.25.0-alpha.0',
    localTestPath: path.resolve(
      __dirname,
      '../../../examples/blank-typescript'
    ),
  },
  {
    name: 'booking-platform',
    description:
      'Booking Platform: Use custom messages and webviews in order to book a reservation in a hotel',
    version: '0.25.0-alpha.0',
    localTestPath: '../../../examples/booking-platform',
  },
  {
    name: 'childs',
    description: 'Childs: Understand how childRoutes works',
    version: '0.25.0-alpha.0',
    localTestPath: '../../../examples/childs',
  },
  {
    name: 'custom-webchat',
    description: 'Custom Webchat: See how it looks like a custom webchat',
    version: '0.25.0-alpha.0',
    localTestPath: '../../../examples/custom-webchat',
  },
  {
    name: 'dynamic-carousel',
    description: 'Dynamic Carousel: See a dynamic carousel for Facebook',
    version: '0.25.0-alpha.0',
    localTestPath: '../../../examples/dynamic-carousel',
  },
  {
    name: 'dynamodb',
    description: 'DynamoDB: Using AWS DynamoDB to track events.',
    version: '0.25.0-alpha.0',
    localTestPath: '../../../examples/dynamodb',
  },
  {
    name: 'handoff',
    description:
      'Handoff: Test how to transfer a conversation into Hubtype Desk',
    version: '0.25.0-alpha.0',
    localTestPath: '../../../examples/handoff',
  },
  {
    name: 'intent',
    description: 'Bot that uses external AI like DialogFlow.',
    version: '0.25.0-alpha.0',
    localTestPath: '../../../examples/intent',
  },
  {
    name: 'telco-offers',
    description:
      'Telco Offers: Flow to acquire an Internet or a cell phone rate using buttons and replies',
    version: '0.25.0-alpha.0',
    localTestPath: '../../../examples/teleco-offers',
  },
  {
    name: 'tutorial',
    description:
      'Tutorial: An example with different examples that help you get started fast',
    version: '0.25.0-alpha.0',
    localTestPath: '../../../examples/tutorial',
  },
]
