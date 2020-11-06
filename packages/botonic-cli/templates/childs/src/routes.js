import Bacon from './actions/bacon'
import Cheese from './actions/cheese'
import Hi from './actions/hi'
import Pasta from './actions/pasta'
import Pizza from './actions/pizza'
import Sausage from './actions/sausage'
import Tomato from './actions/tomato'

export const routes = [
  {
    path: 'hi',
    text: /^hi$/i,
    action: Hi,
    childRoutes: [
      {
        path: 'pizza',
        payload: /^pizza$/i,
        action: Pizza,
        childRoutes: [
          { path: 'sausage', payload: /^sausage$/i, action: Sausage },
          { path: 'bacon', payload: /^bacon$/i, action: Bacon },
        ],
      },
      {
        path: 'pasta',
        payload: /^pasta$/i,
        action: Pasta,
        childRoutes: [
          { path: 'cheese', payload: /^cheese$/i, action: Cheese },
          { path: 'tomato', payload: /^tomato$/i, action: Tomato },
        ],
      },
    ],
  },
]
