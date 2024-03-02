import Start from './actions/start'
import ChooseLanguage from './actions/choose-language'
import Summary from './actions/summary'
import Bye from './actions/bye'
import Phone from './actions/phone'
import Internet from './actions/internet'
import BuyPhone from './actions/buy-phone'
import BuyInternet from './actions/buy-internet'
import BuyOffer from './actions/buy-offer'
import Confirm from './actions/confirm'

export const routes = [
  { path: 'hi', payload: 'hi', action: ChooseLanguage },
  { path: 'set-language', payload: /language-.*/, action: Start },
  {
    path: 'phone',
    payload: 'phone',
    action: Phone,
    childRoutes: [
      {
        path: 'buyPhone',
        payload: /buyPhone-.*/,
        action: BuyPhone,
      },
    ],
  },
  {
    path: 'internet',
    payload: 'internet',
    action: Internet,
    childRoutes: [
      {
        path: 'buyInternet',
        payload: /buyInternet-.*/,
        action: BuyInternet,
        childRoutes: [
          { path: 'buyOffer', payload: /buyOffer-.*/, action: BuyOffer },
        ],
      },
    ],
  },
  {
    path: 'summary',
    payload: 'summary',
    action: Summary,
    childRoutes: [{ path: 'confirm', payload: 'confirm', action: Confirm }],
  },
  { path: 'bye', text: /.*/, payload: /bye-.*/, action: Bye },
]
