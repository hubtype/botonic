import GetShirts from './actions/get-shirts'
import Hi from './actions/hi'

export const routes = [
  /* The first rule matches if and only if we get the text 'hi' and will execute the 
        React component defined in pages/actions/hi.js */
  { path: 'hi', text: 'hi', action: Hi },

  /* These rules capture different payloads */
  { path: 'shirts', payload: /(women-shirts|men-shirts)/, action: GetShirts },
]
