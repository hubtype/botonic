import { LocaleContents } from './index'

const contents: LocaleContents = {
  triggerButtonText: '¿En qué te puedo ayudar?',
  inputPlaceholder: 'Escribe tu pregunta...',
  integrationsMenu: {
    webchat: 'Web chat',
    whatsapp: 'WhatsApp',
  },
  header: {
    title: 'Asistente virtual',
    menuButton: {
      startAgain: 'Comenzar de nuevo',
      downloadTranscript: 'Descargar la conversación',
      leaveChat: 'Salir del chat',
    },
    leaveModal: {
      title: '¿Estás seguro que quieres salir?',
      text: 'Finalizarás la conversación y perderás el historial del chat.',
      stayButton: 'Quedarse',
      leaveButton: 'Salir del chat',
    },
    downloadModal: {
      downloading: {
        title: 'Descargando la conversación',
      },
      downloaded: {
        title: 'Descarga completada!',
        leaveChatButton: 'Salir del chat',
        continueChatButton: 'Continuar la conversación',
      },
      error: {
        title: 'Error en la descarga!',
        text: 'No se ha podido completar la descarga. Inténtalo de nuevo más tarde.',
        continueChatButton: 'Continuar la conversación',
        leaveChatButton: 'Cerrar el chat',
      },
    },
  },
}
export default contents
