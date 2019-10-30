import DateSelected from './actions/dateSelected'
import EmailResponse from './actions/emailResponse'
import Feedback from './actions/feedback'
import GeneralTransfer from './actions/generalTransfer'
import LogInResponse from './actions/logInResponse'
import OfficeInformation from './actions/officeInformation'
import PaymentResponse from './actions/paymentResponse'
import StolenCard from './actions/stolenCard'
import UnsolicitedCharge from './actions/unsolicitedCharge'
import Wait from './actions/wait'
import Webviews from './actions/webviews'
import SelectCalendar from './actions/selectCalendar'
import ResponseCalendar from './actions/responseCalendar'

export const BankRoutes = [
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
    path: 'stolen-card',
    text: /^1$/i,
    action: StolenCard,
    childRoutes: [
      {
        path: 'feedback',
        text: /\b(?!reset|hola|buenas|hello|hi|webview|webviews)\b\S+/i,
        action: Feedback,
        childRoutes: [
          {
            path: 'wait',
            text: /\b(?!reset|hola|buenas|hello|hi|webview|webviews)\b\S+/i,
            action: Wait
          }
        ]
      }
    ]
  },
  {
    path: 'office-information',
    text: /^2$/i,
    action: OfficeInformation,
    childRoutes: [
      {
        path: 'feedback',
        text: /\b(?!reset|hola|buenas|hello|hi|webview|webviews)\b\S+/i,
        action: Feedback,
        childRoutes: [
          {
            path: 'wait',
            text: /\b(?!reset|hola|buenas|hello|hi|webview|webviews)\b\S+/i,
            action: Wait
          }
        ]
      }
    ]
  },
  {
    path: 'unsolicited-charge',
    text: /^3$/i,
    action: UnsolicitedCharge,
    childRoutes: [
      {
        path: 'feedback',
        text: /\b(?!reset|hola|buenas|hello|hi|webview|webviews)\b\S+/i,
        action: Feedback,
        childRoutes: [
          {
            path: 'wait',
            text: /\b(?!reset|hola|buenas|hello|hi|webview|webviews)\b\S+/i,
            action: Wait
          }
        ]
      }
    ]
  },
  {
    path: 'greetings',
    text: /\b(?!reset|hola|buenas|hello|hi|webview|webviews)\b\S+/i,
    action: GeneralTransfer,
    childRoutes: [
      {
        path: 'feedback',
        text: /\b(?!reset|hola|buenas|hello|hi|webview|webviews)\b\S+/i,
        action: Feedback,
        childRoutes: [
          {
            path: 'wait',
            text: /\b(?!reset|hola|buenas|hello|hi|webview|webviews)\b\S+/i,
            action: Wait
          }
        ]
      }
    ]
  }
]
