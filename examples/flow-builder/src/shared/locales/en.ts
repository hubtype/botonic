import { LocaleContents } from './index'

const contents: LocaleContents = {
  triggerButtonText: 'How can I help you?',
  inputPlaceholder: 'Write a reply...',
  integrationsMenu: {
    webchat: 'Web chat',
    whatsapp: 'WhatsApp',
  },
  header: {
    title: 'Virtual assistant',
    menuButton: {
      startAgain: 'Start over',
      downloadTranscript: 'Download transcript',
      leaveChat: 'Leave chat',
    },
    leaveModal: {
      title: 'Are you sure you want to leave?',
      text: 'You will end the conversation and loose your chat history.',
      stayButton: 'Stay',
      leaveButton: 'Leave chat',
    },
    downloadModal: {
      downloading: {
        title: 'Downloading chat transcript',
      },
      downloaded: {
        title: 'Download successful!',
        leaveChatButton: 'Leave Chat',
        continueChatButton: 'Continue conversation',
      },
      error: {
        title: 'Download failed!',
        text: 'Unable to complete download. Please try again later.',
        continueChatButton: 'Continue conversation',
        leaveChatButton: 'Close chat',
      },
    },
  },
}
export default contents
