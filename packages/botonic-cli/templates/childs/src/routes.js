import { Hi } from './actions/hi'
import { Pizza } from './actions/pizza'
import { Sausage } from './actions/sausage'
import { Bacon } from './actions/bacon'
import { Pasta } from './actions/pasta'
import { Cheese } from './actions/cheese'
import { Tomato } from './actions/tomato'

export const routes = [pre
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
          { path: 'bacon', payload: /^bacon$/i, action: Bacon }
        ]
      },
      {
        path: 'pasta',
        payload: /^pasta$/i,
        action: Pasta,
        childRoutes: [
          { path: 'cheese', payload: /^cheese$/i, action: Cheese },
          { path: 'tomato', payload: /^tomato$/i, action: Tomato }
        ]
      }
    ]
  }

  /* There's an implicit rule that captures any other input and maps it to
        the 404 action, it would be equivalent to:
        {type: /^.*$/, action: "404"}
        */
]
