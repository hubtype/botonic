import Start from './actions/start'
import ShowRestaurants from './actions/show-restaurants'
import ShowDirections from './actions/show-directions'
import SayGoodbye from './actions/say-goodbye'
import NotFound from './actions/not-found'

export const routes = [
  { input: i => i.confidence < 0.8, action: NotFound },
  { intent: 'Greetings', action: Start },
  { intent: 'BookRestaurant', action: ShowRestaurants },
  { intent: 'GetDirections', action: ShowDirections },
  { intent: 'Gratitude', action: SayGoodbye }
]
