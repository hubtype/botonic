import Start from './actions/start'
import Carousel from './actions/carousel'
import BookHotel from './actions/book-hotel'
import InfoReservation from './actions/info-reservation'
import CloseWebview from './actions/close-webview'
import Bye from './actions/bye'
import MoreHelp from './actions/more-help'

export const routes = [
  { path: 'start', text: /^start$/i, action: Start },
  {
    path: 'book-hotel',
    payload: /hotel-.*/,
    action: BookHotel,
  },
  {
    path: 'info-reservation',
    payload: /enviar_.*/,
    action: InfoReservation,
  },
  {
    path: 'close-webview',
    payload: 'close-webview',
    action: CloseWebview,
  },
  {
    path: 'carousel',
    payload: 'carousel',
    text: /^.*\b(hotel|book)\b.*$/i,
    action: Carousel,
  },
  {
    path: 'Bye',
    payload: /rating-.*/,
    text: /^bye$/i,
    action: Bye,
  },
  {
    path: 'help',
    text: /.*/,
    payload: /help-.*/,
    action: MoreHelp,
  },
]
