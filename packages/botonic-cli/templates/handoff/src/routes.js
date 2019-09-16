import TransferAgent from './actions/transfer-agent'
import Thanks from './actions/thanks'

export const routes = [
  { path: 'agent', text: /^handoff$/i, action: TransferAgent },
  { path: 'thanks-for-contacting', action: Thanks }
]
