export enum HtNodeWithContentType {
  CAROUSEL = 'carousel',
  HANDOFF = 'handoff',
  IMAGE = 'image',
  TEXT = 'text',
  KEYWORD = 'keyword',
  SMART_INTENT = 'smart-intent',
  FUNCTION = 'function',
  FALLBACK = 'fallback',
  VIDEO = 'video',
  WHATSAPP_BUTTON_LIST = 'whatsapp-button-list',
  WHATSAPP_CTA_URL_BUTTON = 'whatsapp-cta-url-button',
  WHATSAPP_TEMPLATE = 'whatsapp-template',
  KNOWLEDGE_BASE = 'knowledge-base',
  BOT_ACTION = 'bot-action',
  AI_AGENT = 'ai-agent',
  AI_AGENT_ROUTER = 'ai-agent-router',
  AI_AGENT_MANAGER = 'ai-agent-manager',
  RATING = 'rating',
  WEBVIEW = 'webview',
  GO_TO_FLOW = 'go-to-flow',
  CAPTURE_USER_INPUT = 'capture-user-input',
}

export enum HtNodeWithoutContentType {
  URL = 'url',
  PAYLOAD = 'payload',
}

export enum HtButtonStyle {
  BUTTON = 'button',
  QUICK_REPLY = 'quick-reply',
}
