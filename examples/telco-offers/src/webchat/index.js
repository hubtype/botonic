import BotIconWhite from '../assets/white_phone.svg'
import BotIcon from '../assets/phone.svg'
import { CustomTrigger } from './custom-trigger'
import { COLORS } from './constants'

export const webchat = {
  storage: sessionStorage,
  storageKey: 'botonic-telco-example',
  shadowDOM: true,

  onOpen: app => {
    app.clearMessages()
    app.addUserPayload('hi')
  },

  theme: {
    customTrigger: CustomTrigger,
    style: {
      fontFamily: '"Helvetica Neue",Arial,sans-serif',
      width: 370,
      borderRadius: 10,
      background: '#F5F5F5',
      lineHeight: 1.3,
    },
    header: {
      image: BotIconWhite,
      title: 'Botonic Telco Offers',
      style: {
        background: COLORS.PRIMARY_COLOR,
      },
    },
    brand: {
      color: COLORS.PRIMARY_COLOR,
      image: BotIcon,
    },
    triggerButton: {
      image: BotIcon,
    },

    button: {
      style: {
        color: '#000000',
        background: '#ffffff',
        borderRadius: 10,
        border: '1px solid #000000',
        margin: '8px 25px',
        padding: '10px',
        width: '200px',
      },
      hoverBackground: COLORS.MAIN_COLOR,
      hoverTextColor: 'black',
    },
    message: {
      bot: {
        blobTick: false,
        blobWidth: '255px',
        imageStyle: {
          alignItems: 'flex-end',
        },
        style: {
          border: 'none',
          color: 'black',
          borderRadius: '7px',
          background: 'white',
          boxShadow: '1px -1px 6px rgba(0, 0, 0, 0.3)',
        },
      },
      user: {
        blobTick: false,
        style: {
          background: COLORS.PRIMARY_COLOR,
          borderRadius: '12px 12px 0px 12px',
        },
      },
    },
    enableUserInput: false,
    markdownStyle: `
    p { 
      margin: 0px;
    }
    table {
      margin-top: 10px;
      border-collapse: collapse;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      border-radius:5px;
    }
    
    th,
    td {
      border-radius:5px;
      padding: 7px;
      background-color: rgba(255,255,255,0.2);
      color: black;
      text-align: center;
    }
    
    thead {
      border-radius:5px;
      border: 2px solid ${COLORS.PRIMARY_COLOR};
      th {
        border-radius:0px;
        border: 1px solid ${COLORS.PRIMARY_COLOR};
        background-color: ${COLORS.MAIN_COLOR};
      }
    }
    
    tbody {
      border-radius:5px;
      border: 2px solid ${COLORS.PRIMARY_COLOR};
      tr {
        &:hover {
          background-color: rgba(255,255,255,0.3);
        }
        border: 1px solid ${COLORS.PRIMARY_COLOR};
      }
      td {
        border: 1px solid ${COLORS.PRIMARY_COLOR};
        position: relative;
        &:hover {
          &:before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: -9999px;
            bottom: -9999px;
            background-color: rgba(255,255,255,0.2);
            z-index: -1;
          }
        }
      }
    `,
  },
}
