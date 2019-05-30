import Start from './actions/start'
import Thanks from './actions/thanks'
export const routes = [
  { path: 'reply-yes', payload: 'yes', action: Thanks },
  { path: 'reply-no', payload: 'no', action: Thanks },
  { path: 'start', text: /.*/, action: Start }
]
