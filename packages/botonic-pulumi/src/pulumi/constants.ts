// Pulumi Projects
export const PROJECT_NAME_SEPARATOR = '-'
export const MAX_PROJECT_NAME_LENGTH = 30

// Commands to build dev project
export const BUILD_COMMANDS = [
  {
    name: 'WebSocket Server Build',
    command: 'yarn workspace api build:websocket',
  },
  {
    name: 'Handlers Build',
    command: 'yarn workspace api build:handlers',
  },
  {
    name: 'Rest Server Build',
    command: 'yarn workspace api build:rest',
  },
  {
    name: 'Static Contents Build',
    command: 'yarn workspace webchat build',
  },
]

// Pulumi Environment
export const PULUMI_BINARY_NAME = 'pulumi'

// Botonic Stacks
export const BACKEND_STACK_NAME = 'backend'
export const FRONTEND_STACK_NAME = 'frontend'
