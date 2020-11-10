import BookRestaurant from './actions/book-restaurant'
import GetDirections from './actions/get-directions'
import NotFound from './actions/not-found'
import ShowWeather from './actions/show-weather'
import Start from './actions/start'

export const routes = [
  { text: 'hi', action: Start },
  { input: i => i.confidence < 0.7, action: NotFound },
  { intent: 'GetDirections', action: GetDirections },
  { intent: 'GetWeather', action: ShowWeather },
  { intent: 'BookRestaurant', action: BookRestaurant },
]
