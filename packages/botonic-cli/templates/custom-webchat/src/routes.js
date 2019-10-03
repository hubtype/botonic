import Start from './actions/start'
import Help from './actions/help'
import ShowButtons from './actions/show-buttons'
import ShowReplies from './actions/show-replies'
export const routes = [
  { path: 'help', payload: 'help', action: Help },
  { path: 'buttons', payload: 'buttons', action: ShowButtons },
  { path: 'replies', payload: 'replies', action: ShowReplies },
  { path: 'start', text: /.*/, action: Start }
]
