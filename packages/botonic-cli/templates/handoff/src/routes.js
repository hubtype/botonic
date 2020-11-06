import Thanks from './actions/thanks'
import TransferAgent from './actions/transfer-agent'

export const routes = [
  { path: 'agent', text: /^handoff$/i, action: TransferAgent },
  { path: 'thanks-for-contacting', action: Thanks },
]
