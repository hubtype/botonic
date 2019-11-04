import { Input, Session } from '@botonic/core'
import DateSelected from './actions/dateSelected'
import EmailResponse from './actions/emailResponse'
import Greetings from './actions/greetings'
import LogInResponse from './actions/logInResponse'
import PaymentResponse from './actions/paymentResponse'
import Webviews from './actions/webviews'
import SelectCalendar from './actions/selectCalendar'
import ResponseCalendar from './actions/responseCalendar'
import { BankRoutes } from './routes_bank'

const introRegex = /(reset|hola|buenas|hello|hi)/i

export function routes(_: { input: Input; session: Session }): any {
  if (_.input.data.match(introRegex) || _.session.is_first_interaction) {
    _.session['sayHi'] = true
    return [
      {
        path: 'general',
        text: /.*/,
        action: Greetings
      }
    ]
  }

  return [
    { path: 'webviews', text: /^(webview|webviews)$/i, action: Webviews },
    { path: 'calendar', text: 'calendar', action: SelectCalendar },
    {
      path: 'fin_reserva',
      text: /Reservation for (.*)/,
      payload: /^FECHA_.*/,
      action: ResponseCalendar
    },
    { path: 'date', payload: /DATES_SELECTED-.*/, action: DateSelected },
    { path: 'email', payload: /___Email.*/, action: EmailResponse },
    { path: 'payment', payload: /__CardN.*/, action: PaymentResponse },
    { path: 'login', payload: /___LogIn.*/, action: LogInResponse },
    {
      path: 'general',
      text: /.*/,
      action: Greetings,
      childRoutes: [...BankRoutes]
    }
  ]
}
