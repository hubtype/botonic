import { TransferAgent } from './actions/transfer_agent'

export const routes = [
	{ path: 'transfer', text: /^handoff$/i, action: TransferAgent }
]
