import NotFound from './actions/not-found'
import Start from './actions/start'
import Help from './actions/help'
import ShowButtons from './actions/show-buttons'
import ShowReplies from './actions/show-replies'
export const routes = [
  { path: 'help', payload: 'help', action: Help },
  {
    path: 'buttons',
    input: i => i.payload == 'buttons' || i.data == 'buttons',
    action: ShowButtons,
  },
  {
    path: 'replies',
    input: i => i.payload == 'replies' || i.data == 'replies',
    action: ShowReplies,
  },
  { path: 'start', text: /hi|start|hello/, action: Start },
  { path: '404', text: /.*/, action: NotFound },
]
