import path from 'path'

import { BotonicProject } from './interfaces'

const exampleTestPath = path.resolve(__dirname, '..', '..', '..', 'examples')
const exampleVersion = '0.31.0'

export const EXAMPLES: BotonicProject[] = [
  {
    name: 'blank',
    description: 'Blank: A minimal template to start from scratch',
    version: exampleVersion,
    localTestPath: path.resolve(exampleTestPath, 'blank'),
  },
  {
    name: 'blank-typescript',
    description: 'Blank (TypeScript): A minimal template to start from scratch',
    version: exampleVersion,
    localTestPath: path.resolve(exampleTestPath, 'blank-typescript'),
  },
  {
    name: 'booking-platform',
    description:
      'Booking Platform: Use custom messages and webviews in order to book a reservation in a hotel',
    version: exampleVersion,
    localTestPath: path.resolve(exampleTestPath, 'booking-platform'),
  },
  {
    name: 'childs',
    description: 'Childs: Understand how childRoutes works',
    version: exampleVersion,
    localTestPath: path.resolve(exampleTestPath, 'childs'),
  },
  {
    name: 'custom-webchat',
    description: 'Custom Webchat: See how it looks like a custom webchat',
    version: exampleVersion,
    localTestPath: path.resolve(exampleTestPath, 'custom-webchat'),
  },
  {
    name: 'dynamic-carousel',
    description: 'Dynamic Carousel: See a dynamic carousel for Facebook',
    version: exampleVersion,
    localTestPath: path.resolve(exampleTestPath, 'dynamic-carousel'),
  },
  {
    name: 'dynamodb',
    description: 'DynamoDB: Using AWS DynamoDB to track events.',
    version: exampleVersion,
    localTestPath: path.resolve(exampleTestPath, 'dynamodb'),
  },
  {
    name: 'handoff',
    description:
      'Handoff: Test how to transfer a conversation into Hubtype Desk',
    version: exampleVersion,
    localTestPath: path.resolve(exampleTestPath, 'handoff'),
  },
  {
    name: 'intent',
    description: 'Bot that uses external AI like DialogFlow.',
    version: exampleVersion,
    localTestPath: path.resolve(exampleTestPath, 'intent'),
  },
  {
    name: 'telco-offers',
    description:
      'Telco Offers: Flow to acquire an Internet or a cell phone rate using buttons and replies',
    version: exampleVersion,
    localTestPath: path.resolve(exampleTestPath, 'telco-offers'),
  },
  {
    name: 'tutorial',
    description:
      'Tutorial: An example with different examples that help you get started fast',
    version: exampleVersion,
    localTestPath: path.resolve(exampleTestPath, 'tutorial'),
  },
]
