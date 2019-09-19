import { MyReply } from './myReply'
import { MyButton } from './myButton'
import { MyHeader } from './myHeader'
import MyCalendarMessage from './myCalendarMessage'
import Logo from '../assets/bot_vader.jpg'

export const webchat = {
  theme: {
    brandColor: '#ff0000',
    textPlaceholder: 'Please, type your message:',
    title: 'Custom Webchat',
    brandIconUrl: Logo,
    customReply: MyReply,
    customButton: MyButton,
    customHeader: MyHeader,
    customMessageTypes: [MyCalendarMessage]
  }
}
