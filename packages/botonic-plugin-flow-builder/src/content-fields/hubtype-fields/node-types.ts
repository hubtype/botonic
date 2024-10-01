export enum HtNodeWithContentType {
  CAROUSEL = 'carousel',
  HANDOFF = 'handoff',
  IMAGE = 'image',
  TEXT = 'text',
  KEYWORD = 'keyword',
  INTENT = 'intent',
  SMART_INTENT = 'smart-intent',
  FUNCTION = 'function',
  FALLBACK = 'fallback',
  VIDEO = 'video',
  WHATSAPP_BUTTON_LIST = 'whatsapp-button-list',
  WHATSAPP_CTA_URL_BUTTON = 'whatsapp-cta-url-button',
  KNOWLEDGE_BASE = 'knowledge-base',
  BOT_ACTION = 'bot-action',
}

export enum HtNodeWithoutContentType {
  URL = 'url',
  PAYLOAD = 'payload',
  GO_TO_FLOW = 'go-to-flow',
}

export enum HtButtonStyle {
  BUTTON = 'button',
  QUICK_REPLY = 'quick-reply',
}
