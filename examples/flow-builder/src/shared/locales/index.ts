import { isBrowser } from '../../server/utils/env-utils'
import { COUNTRIES, LANGUAGES } from '../constants'
import en from './en'
import es from './es'

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES]
export type Country = (typeof COUNTRIES)[keyof typeof COUNTRIES]

export type LocaleContents = {
  triggerButtonText: string
  inputPlaceholder: string
  integrationsMenu: {
    webchat: string
    whatsapp: string
  }
  header: {
    title: string
    menuButton: {
      startAgain: string
      downloadTranscript: string
      leaveChat: string
    }
    leaveModal: {
      title: string
      text: string
      stayButton: string
      leaveButton: string
    }
    downloadModal: {
      downloading: {
        title: string
      }
      downloaded: {
        title: string
        leaveChatButton: string
        continueChatButton: string
      }
      error: {
        title: string
        text: string
        continueChatButton: string
        leaveChatButton: string
      }
    }
  }
}
export const locales: Record<Language, LocaleContents> = { es, en }

export function getLocalContents(language?: Language): LocaleContents {
  return locales[language ?? getLanguage()]
}

export function getLanguage(): Language {
  if (isBrowser()) {
    const botonicState = JSON.parse(
      localStorage.getItem('botonicState') ??
        sessionStorage.getItem('botonicState') ??
        '{}'
    )
    const language = botonicState?.session?.user?.extra_data?.language ?? ''
    return language || LANGUAGES.spanish
  }
  return LANGUAGES.spanish
}
