import Start from './actions/start'
import Thanks from './actions/thanks'
export const routes = [
	{ path: 'reply', payload: 'yes', action: Thanks },
	{ path: 'reply', payload: 'no', action: Thanks },
	{ path: 'start', text: /.*/, action: Start }
]
